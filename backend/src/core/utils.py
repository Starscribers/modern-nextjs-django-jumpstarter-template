from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Self

from django.core import serializers

if TYPE_CHECKING:
    from collections.abc import Iterable


import contextlib
import csv
import datetime
import hashlib
import logging
import os
import shutil
import subprocess
import tempfile
import time
from contextlib import contextmanager
from functools import wraps
from itertools import zip_longest
from re import sub
from typing import TYPE_CHECKING

import boto3
import psutil
from django.db import transaction
from django.db.utils import IntegrityError
from django.utils import timezone

from core.storages import FileStorage

from .config import settings
from .exceptions import ExceededMaximumRetryAttemptsError

if TYPE_CHECKING:
    import uuid
    from collections.abc import Callable, Generator, Iterable
    from types import TracebackType
    from typing import Any, Self

    from django.core.files.storage import Storage
    from django.db import models
    from rest_framework import serializers

logger = logging.getLogger("default")


def camel_case(string: str) -> str:
    string = sub(r"([_-])+", " ", string).title().replace(" ", "")
    return "".join([string[0].lower(), string[1:]])


def snake_case(string: str) -> str:
    string = sub(r"(\d)+", r"_\1", string)
    string = sub(r"([A-Z])+", r"_\1", string).lower()
    return sub(r"([_-])+", "_", string)


def make_key_snake_case_recursive(item: dict | list | object) -> dict | list:
    if isinstance(item, dict):
        return {
            snake_case(k): make_key_snake_case_recursive(v) for k, v in item.items()
        }
    if isinstance(item, list):
        return [make_key_snake_case_recursive(i) for i in item]

    return item


def iterate_member_partitions() -> range:
    return range(settings.MEMBER_PARTITION_COUNT)


def iterate_journey_partition_keys() -> range:
    return range(settings.MEMBER_PARTITION_COUNT // settings.JOURNEY_PARTITION_COUNT)


def get_partition_ids_from_partition_key(partition_key: int) -> list[int]:
    return [
        partition_key * settings.SK_PARTITION_COUNT + i
        for i in range(settings.SK_PARTITION_COUNT)
    ]


@contextmanager
def create_temp_folder_and_upload_to_s3(
    bucket_name: str,
    *s3_paths: list[str],
) -> Generator:
    """
    Create a temporary folder and upload to S3.
    """

    temp_folder = tempfile.mkdtemp()
    msg = f"\no - Created temp folder: {temp_folder}"
    logger.info(msg)
    fs = FileStorage(settings.FILESTORE_BACKEND, bucket_name=bucket_name)
    try:
        yield temp_folder
        # upload everything in tmp folder to s3_path
        for s3_path in s3_paths:
            msg = f"\no - Uploading temp folder to s3://{bucket_name}/{s3_path}"
            logger.info(msg)
            for root, _, files in os.walk(temp_folder):
                for f in files:
                    msg = f"  o - Uploading {f}"
                    logger.info(msg)
                    s3_key = Path(s3_path) / f
                    fs.upload_file(
                        Path(root) / f,
                        str(s3_key),
                    )
            msg = f"\no - Uploaded temp folder to s3://{bucket_name}/{s3_path}"
            logger.info(msg)

    finally:
        shutil.rmtree(temp_folder)
        msg = f"\no - Deleted temp folder: {temp_folder}"
        logger.info(msg)


def batched(data: Iterable, batch_size: int) -> Generator[list, None, None]:
    for i in range(0, len(data), batch_size):
        yield data[i : i + batch_size]


def compress_files(
    zip_file_name: str,
    files_to_compress: list[str],
    password: str | None = None,
) -> int:
    """
    If OS is Windows, bypass the compress.
    Password is only supported on Linux.
    Returns
    -------
        filesize of the zip file: int
    """
    files_to_compress_str = " ".join(
        [str(filename) for filename in files_to_compress],
    )
    if os.name == "nt":
        logger.warning("Windows OS, bypass the compress.")
        return 0
    password_param = f"-P {password}" if password else ""
    subprocess.run(  # noqa: S602
        f"zip {password_param} "  # password
        f'-r "{zip_file_name}" '  # zip file name
        f"{files_to_compress_str} "  # include files
        "-j",  # junk the path, do not make directory structure
        shell=True,
        check=True,
    )
    for file_to_compress in files_to_compress:
        Path(file_to_compress).unlink()

    return Path(zip_file_name).stat().st_size


def get_partition(gid: str) -> int:
    sha256_hash = hashlib.sha256(gid.encode()).hexdigest()
    return int(sha256_hash, 16) % settings.MEMBER_PARTITION_COUNT


def get_partition_key(gid: str) -> int:
    return get_partition(gid) // 10


def get_journey_partition_key(gid: str) -> int:
    return get_partition(gid) // settings.JOURNEY_PARTITION_COUNT


def get_table_partition(gid: str, table_count: int) -> int:
    return get_partition_key(gid) % table_count


def get_sk_partition(gid: str) -> int:
    return get_partition(gid) % 10


def get_current_date_dict() -> dict[str, int]:
    now = timezone.now()
    return {
        "year": now.year,
        "month": now.month,
        "day": now.day,
    }


def get_file_size(file_path: str) -> int:
    if Path(file_path).exists():
        return Path(file_path).stat().st_size
    return 0


def get_current_date_str(date_format: str = "%Y-%m-%d") -> str:
    now = timezone.localtime()
    return now.strftime(date_format)


def flush_stage_cache(
    rest_api_id: str | None = None,
    stage_name: str | None = None,
) -> bool:
    """Flush the stage cache in API Gateway.

    Args:
        rest_api_id (str): REST API ID, the default value is in the settings.
        stage_name (str): Stage name, the default value is in the settings.
    Returns:
        bool: True if the stage cache is flushed successfully, otherwise False.
    """

    logger.info("Flushing the stage cache in API Gateway...")

    if not rest_api_id:
        rest_api_id = settings.REST_API_ID
    if not stage_name:
        stage_name = settings.STAGE_NAME

    client = boto3.client("apigateway")
    try:
        client.flush_stage_cache(
            restApiId=rest_api_id,
            stageName=stage_name,
        )
        msg = f"Flushed the stage cache in API Gateway: {rest_api_id} {stage_name}"
        logger.info(msg)
    except Exception as e:
        msg = f"Failed to flush the stage cache in API Gateway: {e}"
        logger.exception(msg)
        return False
    else:
        return True


class BatchCSVWriter:
    """
    A CSV writer which will write rows to CSV file "by batch".
    """

    def __init__(  # noqa: PLR0913
        self: Self,
        folder: str,
        filename_format: str,
        headers: list | None = None,
        delimiter: str = ",",
        file_limit_bytes: int | None = settings.MAX_FILE_SIZE_BYTES,
        ok_file_name: str | None = None,
        ok_file_content: str = "",
    ) -> None:
        """
        Arguments:
            - file_limit_bytes:
                setting file_limit_bytes to 0 will only write everything into one file with no limit.
            - ok_file_name:
                if specified, the ok file will be created after all the csv files are uploaded.
                format variables: batch_number
            - ok_file_content:
                the content of the ok file, if not specified, the content will be blank.
                or override the get_ok_file_content method to customize the content.
                format variables: batch_number
        """
        self.batch_number = 0
        self.writer = None
        self.csv_file = None
        self.folder = folder
        # if specified, the first row of the csv file will be the headers
        self.headers = headers

        # filename format must have {batch_number} placeholders
        self.filename_format = filename_format
        self.delimiter = delimiter
        self.file_limit_bytes = file_limit_bytes

        self.ok_file_name = ok_file_name
        self.ok_file_content = ok_file_content or ""

    def write_no_data_row(self: Self, no_data_mark: str = "N/A") -> None:
        self.write([no_data_mark] * len(self.headers))

    def get_ok_file_context(self: Self) -> dict:
        return {
            "batch_number": self.batch_number,
        }

    def get_ok_file_name(self: Self) -> str:
        context = self.get_ok_file_context()
        return self.ok_file_name.format(
            **context,
        )

    def get_ok_file_content(self: Self) -> str:
        context = self.get_ok_file_context()
        return self.ok_file_content.format(
            **context,
        )

    def write_ok_file(self: Self) -> None:
        if self.ok_file_name:
            ok_file_name = self.get_ok_file_name()
            ok_file_content = self.get_ok_file_content()
            ok_file_path = Path(self.folder) / ok_file_name
            with ok_file_path.open("w") as f:
                f.write(ok_file_content)

    def open_new_file(
        self: Self,
        columns: list[str] | None = None,
        filename_format: str | None = None,
    ) -> tuple[csv.writer, str]:
        if filename_format:
            self.filename_format = filename_format

        if columns:
            self.headers = columns

        file_name = self.filename_format.format(
            batch_number=self.batch_number,
        )
        file_full_path = Path(self.folder) / file_name
        csv_file = Path(file_full_path).open("w")  # noqa: SIM115
        writer = csv.writer(csv_file, delimiter=self.delimiter)
        if self.headers:
            writer.writerow(self.headers)
        self.writer = writer
        self.csv_file = csv_file

    def write(
        self: Self,
        row: list,
    ) -> None:
        self.writer.writerow(row)

        # 檢查目前檔案大小是否超過上傳上限
        if (
            self.file_limit_bytes
            and get_file_size(self.csv_file.name) >= self.file_limit_bytes
        ):
            self.batch_number += 1
            self.csv_file.close()
            self.open_new_file()

    def close(
        self: Self,
    ) -> None:
        self.csv_file.close()

    def __enter__(
        self: Self,
    ) -> Self:
        self.open_new_file()
        return self

    def __exit__(
        self: Self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        traceback: TracebackType | None,
    ) -> bool | None:
        self.close()
        self.write_ok_file()


def get_uuid_in_serializer(serializer: serializers.ModelSerializer) -> uuid.UUID | None:
    """Get the request uuid in the serializer."""
    return serializer.context["request"].parser_context["kwargs"].get("uuid")


def get_operating_model(
    serializer: serializers.ModelSerializer,
    uuid: uuid.UUID | None = None,
) -> models.Model:
    """Get the model associated with the serialized object.

    When updating or reviewing, get the model from view's `get_object()` method.
    When creating an object, get the model from serializer metaclass model because
    `serializer.instance.__class__` will be empty.

    Determine whether `uuid` exists to know the current request method.
    """
    if uuid is not None:
        return serializer.instance.__class__
    return serializer.Meta.model


def parse_iso_datetime(iso_string: str) -> datetime.datetime:
    return datetime.datetime.strptime(iso_string, "%Y-%m-%dT%H:%M:%S.%f%z").astimezone(
        settings.TIMEZONE,
    )


def trans_error_message(error: Exception) -> str:
    err_module = type(error).__module__
    err_type = type(error).__name__
    err_content = str(error)
    return f"{err_module}.{err_type}: {err_content}"


def get_system_status() -> str:
    cpu_percent = get_current_cpu_percent()
    memory_percent, memory_gb = get_memory_usage()
    return (
        f" | current cpu percent: {cpu_percent}% | current memory percent: {memory_percent}%"
        f" | current memory usage: {memory_gb}GB"
    )


def get_current_cpu_percent() -> float:
    """Get the current CPU usage percentage."""
    return psutil.cpu_percent(0.1)


def get_memory_usage() -> tuple[float, float]:
    """Get the memory usage in percentage and GB."""
    memory = psutil.virtual_memory()
    memory_percent = memory[2]
    memory_usage_in_gb = memory[3] / 1_000_000_000
    return memory_percent, memory_usage_in_gb


def safe_divide(a: float, b: float, default: float | None = 0) -> float | None:
    """Divide two numbers safely."""
    if b == 0:
        return default
    return a / b


def get_safe_file_name(file_name: str) -> str:
    """Get a safe file name."""
    return sub(r"[/\\?%*:|\"<>\x7F\x00-\x1F]", "-", file_name)


def value_with_comma(value: str | float, prefer_int: bool = False) -> str:
    if isinstance(value, int | float):
        if prefer_int and value == int(value):
            value = int(value)
        return f"{value:,}"
    return value


def format_dict_value_to_string_with_comma(target_dict: dict) -> dict:
    """Format the dict value to string with comma."""
    return {key: value_with_comma(value) for key, value in target_dict.items()}


def submit_fargate_task(
    cluster: str,
    task_definition: str,
    overrides: dict,
    network_configuration: dict,
) -> dict:
    # 初始化 ECS 客戶端
    client = boto3.client("ecs")

    # 啟動任務
    return client.run_task(
        cluster=cluster,
        taskDefinition=task_definition,
        launchType="FARGATE",
        overrides=overrides,
        networkConfiguration=network_configuration,
    )


@contextmanager
def access_file_as_data(
    file_key: str,
    auto_commit: bool = True,
) -> Generator:
    """
    Access file in Object Storage.
    """
    from eventhub.models import ObjectStorageFileLock

    with contextlib.suppress(IntegrityError):
        obj, _ = ObjectStorageFileLock.objects.get_or_create(file_key=file_key)

    on_success = None
    retry = 0
    if auto_commit:
        locked = True

        def on_success(file_size: int, duration: int) -> None:
            ObjectStorageFileLock.objects.filter(file_key=file_key).update(
                access_lock=False,
            )

        while locked:
            with transaction.atomic():
                obj = (
                    ObjectStorageFileLock.objects.select_for_update()
                    .filter(file_key=file_key)
                    .get()
                )
                locked = obj.access_lock
                if not locked:
                    obj.access_lock = True
                    obj.save(update_fields=["access_lock"])
            if locked:
                retry += 1
                logger.info("Waiting for file lock %s", file_key)
                time.sleep(60)

            max_retry = 100
            if retry > max_retry:
                msg = f"Failed to get file lock {file_key}"
                raise TimeoutError(msg)

    with obj.yield_storage_data(
        file_key,
        auto_commit=auto_commit,
        on_success=on_success,
    ) as data:
        yield data


def retry(retry_attempts: int = 3, retry_time_sleep: float = 1) -> Callable:
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def warp_func(*args: tuple, **kwargs: dict) -> any:
            for _ in range(retry_attempts):
                try:
                    func_result = func(*args, **kwargs)
                except Exception as e:  # noqa: BLE001
                    error_message = e
                    time.sleep(retry_time_sleep)
                else:
                    return func_result
            raise ExceededMaximumRetryAttemptsError(error_message)

        return warp_func

    return decorator


def bulk_update_or_create(
    model: type,
    data: list[dict],
    match_field: str,
    create_fields: list[str],
    update_fields: list[str],
) -> None:
    """
    Bulk update or create the model instance
    """
    if not data:
        return

    match_field_values = {item[match_field] for item in data}
    existing_objs = []
    for batch in batched(list(match_field_values), 1000):
        existing_objs.extend(model.objects.filter(**{f"{match_field}__in": batch}))
    match_field_to_existing = {
        getattr(record, match_field): record for record in existing_objs
    }

    to_create = []
    to_update = []

    for item in data:
        current_field_value = item[match_field]
        if current_field_value in match_field_to_existing:
            # update existing order
            target_to_update = match_field_to_existing[current_field_value]
            for field in update_fields:
                setattr(target_to_update, field, item[field])
            to_update.append(target_to_update)
        else:
            new_instance = model()
            for field in create_fields:
                setattr(new_instance, field, item[field])
            to_create.append(new_instance)

    if to_create:
        model.objects.bulk_create(to_create, settings.BATCH_SIZE, ignore_conflicts=True)
    if to_update:
        model.objects.bulk_update(to_update, update_fields, settings.BATCH_SIZE)


def zip_by_first_iterable(
    first_iterable: Iterable,
    following_iterable: Iterable,
    fillvalue: str = "",
) -> list[tuple[Any, Any]]:
    """
    Zip two iterables by first iterable.

    if the first iterable is longer than the following iterable, than we fill the following iterable with fillvalue
    if the first iterable is shorter than the following iterable, than we crop the following iterable
    """
    if not first_iterable or not following_iterable:
        raise ValueError

    if len(first_iterable) > len(following_iterable):
        # Fill the shorter iterable with fillvalue
        return zip_longest(
            first_iterable,
            following_iterable,
            fillvalue=fillvalue,
        )

    # Crop the longer iterable
    return zip(first_iterable, following_iterable, strict=False)


def yield_subclasses(
    cls: type[Self],
    concrete_only: bool = False,
) -> Generator[type[Self], None, None]:
    for subclass in cls.__subclasses__():
        if not concrete_only or not (
            subclass.get_meta().abstract or subclass.get_meta().proxy
        ):
            yield subclass

        yield from yield_subclasses(
            subclass,
            concrete_only=concrete_only,
        )


def strip_query_params(url: str) -> str:
    """
    Strip query parameters from a URL.
    """
    return url.split("?")[0] if "?" in url else url


def get_image_storage() -> Storage:
    from core.storages import bucket_image

    return bucket_image.get_django_storage()


def get_upload_file_storage() -> Storage:
    from core.storages import bucket_filestore

    return bucket_filestore.get_django_storage()


def get_filestore_storage() -> Storage:
    from core.storages import bucket_filestore

    return bucket_filestore.get_django_storage()
