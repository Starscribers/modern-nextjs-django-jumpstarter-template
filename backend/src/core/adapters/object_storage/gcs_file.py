from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any, Self

from google.cloud import storage
from google.cloud.exceptions import NotFound

from core.config import settings

if TYPE_CHECKING:
    from collections.abc import Generator

    from core.config.storage import StorageOptions


def gcs_connect() -> storage.Client:
    """Create a GCS client connection."""
    return storage.Client()


class GCSFile:
    """
    GCS file handling utility for object operations and path listing.
    """

    def __init__(self: Self, options: StorageOptions) -> None:
        if not options or not options.BUCKET_NAME:
            self.bucket_name = getattr(
                settings,
                "DATAHUB_BUCKET_NAME",
                "default-bucket",
            )
        else:
            self.bucket_name = options.BUCKET_NAME
        self.client = gcs_connect()
        self.bucket = self.client.bucket(self.bucket_name)

    def list_objects_with_path(
        self: Self,
        foldername: str = "",
        gcs_prefix: str = "gs",
        filter_csv: bool = False,
    ) -> list[str]:
        """List objects with full GCS path."""
        fn_list = self.list_objects(foldername, filter_csv)

        return [f"{gcs_prefix}://{self.bucket_name}/{f}" for f in fn_list]

    def list_objects(
        self: Self,
        foldername: str = "",
        filter_csv: bool = False,
    ) -> list[str]:
        """
        List objects in the bucket, optionally filtering for CSV files.
        """
        files = list(self.list_objects_recursive(foldername))
        if filter_csv:
            return [f for f in files if "_SUCCESS" not in f and f.endswith(".csv")]

        return files

    def list_objects_recursive(
        self: Self,
        prefix: str = "",
    ) -> Generator[str, None, None]:
        """Recursively list all objects with the given prefix."""
        blobs = self.bucket.list_blobs(prefix=prefix)
        for blob in blobs:
            yield blob.name

    def file_exist(self: Self, prefix: str) -> bool:
        """Check if any files exist with the given prefix."""
        return len(self.list_objects(prefix, filter_csv=False)) > 0

    def get_last_modified(self: Self, key: str) -> str:
        """Get the last modified time of an object."""
        blob = self.bucket.blob(key)
        blob.reload()
        return blob.time_created.isoformat() if blob.time_created else ""

    def generate_presigned_url(self: Self, key: str, expires_in: int = 3600) -> str:
        """Generate a signed URL for temporary access to the object."""
        blob = self.bucket.blob(key)
        return blob.generate_signed_url(
            expiration=expires_in,
            method="GET",
        )

    def load_json_raw(self: Self, file_key: str) -> str:
        """Load raw JSON content from a file."""
        blob = self.bucket.blob(file_key)
        return blob.download_as_text()

    def upload_file(self: Self, local_path: str, key: str) -> None:
        """Upload a file from local path to GCS."""
        blob = self.bucket.blob(key)
        blob.upload_from_filename(local_path)

    def download_file(self: Self, key: str, remote_path: str) -> None:
        """Download a file from GCS to local path."""
        blob = self.bucket.blob(key)
        blob.download_to_filename(remote_path)

    def get_object(self: Self, key: str) -> bytes:
        """Get object content as bytes."""
        blob = self.bucket.blob(key)
        return blob.download_as_bytes()

    def put_object(self: Self, obj: dict[str, Any], key: str) -> None:
        """Put a JSON object to GCS."""
        blob = self.bucket.blob(key)
        blob.upload_from_string(
            json.dumps(obj),
            content_type="application/json",
        )

    def head_object(self: Self, key: str) -> dict[str, Any]:
        """Get object metadata."""
        blob = self.bucket.blob(key)
        try:
            blob.reload()
        except NotFound:
            return {}
        else:
            return {
                "ContentLength": blob.size,
                "LastModified": blob.time_created,
                "ETag": blob.etag,
                "ContentType": blob.content_type,
            }

    def delete_object(self: Self, key: str) -> None:
        """
        Delete an object from GCS.
        Developer use only.
        """
        blob = self.bucket.blob(key)
        blob.delete()


class FirstTimeTaggingMembers(GCSFile):
    """GCS implementation for first-time tagging members."""

    def __init__(
        self: Self,
        partition: int,
        tag_uuid: str,
        time_key: str,
    ) -> None:
        super().__init__(None)  # type: ignore[arg-type]
        self.partition = partition
        self.file_key = f"tagging/{tag_uuid}/{time_key}/{self.partition:04d}.json"
        self.path_key = f"tagging/{tag_uuid}/{time_key}/"

    def insert_file(self: Self, data: list[Any]) -> None:
        """Insert data to a JSON file in GCS."""
        blob = self.bucket.blob(self.file_key)
        blob.upload_from_string(
            json.dumps(data),
            content_type="application/json",
        )

    def get_file(self: Self, file_key: str | None = None) -> list[Any]:
        """Get data from a JSON file in GCS."""
        try:
            blob = self.bucket.blob(file_key if file_key else self.file_key)
            file_content = blob.download_as_text()
            data = json.loads(file_content)
        except (NotFound, json.JSONDecodeError):
            data = []

        return data

    def iterate_all_members(self: Self) -> Generator[list[Any], None, None]:
        """Iterate through all member files in the path."""
        for file in self.list_objects(self.path_key, filter_csv=False):
            if file.endswith(".json"):
                yield self.get_file(file)

    def delete_all_files(self: Self) -> bool:
        """Delete all files in the path."""
        file_list = self.list_objects(self.path_key, filter_csv=False)
        if not file_list:
            return True

        try:
            for file in file_list:
                blob = self.bucket.blob(file)
                blob.delete()
        except (NotFound, Exception):
            return False
        else:
            return True
