from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any, Self

import boto3

from core.config import settings

if TYPE_CHECKING:
    from collections.abc import Generator

    from botocore.httpchecksum import StreamingChecksumBody

    from core.config.storage import StorageOptions


def s3_connect() -> boto3.client:
    return boto3.client("s3", endpoint_url=settings.S3_ENDPOINT_URL)


class S3File:
    """
    s3 處理物件或取得路徑檔案列表工具
    """

    def __init__(self: Self, options: StorageOptions) -> None:
        if not options:
            self.bucket_name = settings.DATAHUB_BUCKET_NAME
        else:
            self.bucket_name = options.BUCKET_NAME
        self.s3 = s3_connect()

    def list_objects_with_path(
        self: Self,
        foldername: str = "",
        s3_prefix: str = "s3a",
        filter_csv: bool = True,
    ) -> list[str]:
        fn_list = self.list_objects(foldername, filter_csv)
        return [f"{s3_prefix}://{self.bucket_name}/{f}" for f in fn_list]

    def list_objects(
        self: Self,
        foldername: str = "",
        filter_csv: bool = True,
    ) -> list[str]:
        """
        expect only .csv file is needed
        """
        files = list(self.list_objects_recursive(foldername))
        if filter_csv:
            return [f for f in files if "_SUCCESS" not in f and f.endswith(".csv")]

        return files

    def list_objects_recursive(
        self: Self,
        prefix: str = "",
    ) -> Generator[str, None, None]:
        paginator = self.s3.get_paginator("list_objects_v2")
        operation_parameters = {"Bucket": self.bucket_name, "Prefix": prefix}
        page_iterator = paginator.paginate(**operation_parameters)

        for page in page_iterator:
            if page.get("Contents") is not None:
                for obj in page["Contents"]:
                    yield obj["Key"]

            if page.get("CommonPrefixes") is not None:
                for common_prefix in page["CommonPrefixes"]:
                    yield from self.list_objects_recursive(common_prefix["Prefix"])

    def file_exist(self: Self, prefix: str) -> bool:
        return len(self.list_objects(prefix, filter_csv=False)) > 0

    def get_last_modified(self: Self, key: str) -> str:
        return self.s3.head_object(Bucket=self.bucket_name, Key=key)["LastModified"]

    def generate_presigned_url(self: Self, key: str, expires_in: int = 3600) -> str:
        return self.s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": key},
            ExpiresIn=expires_in,
        )

    def load_json_raw(self: Self, file_key: str) -> str:
        response = self.s3.get_object(Bucket=self.bucket_name, Key=file_key)
        return response["Body"].read().decode("utf-8")

    def upload_file(self: Self, local_path: str, key: str) -> None:
        self.s3.upload_file(
            local_path,
            self.bucket_name,
            key,
        )

    def download_file(self: Self, key: str, remote_path: str) -> None:
        self.s3.download_file(
            self.bucket_name,
            key,
            remote_path,
        )

    def get_object(self: Self, key: str) -> StreamingChecksumBody:
        return self.s3.get_object(Bucket=self.bucket_name, Key=key)["Body"]

    def put_object(self: Self, obj: dict[str, Any], key: str) -> None:
        self.s3.put_object(
            Bucket=self.bucket_name,
            Key=key,
            Body=json.dumps(obj),
            ContentType="application/json",
        )

    def head_object(self: Self, key: str) -> dict[str, Any]:
        return self.s3.head_object(Bucket=self.bucket_name, Key=key)

    def delete_object(self: Self, key: str) -> None:
        """
        Developer using only
        """
        self.s3.delete_object(Bucket=self.bucket_name, Key=key)
