"""
Test file for GCS Storage Adapter.

This file demonstrates how to use the GCS adapter and can be used for testing.
"""

from __future__ import annotations

import logging
import sys
import tempfile
import time
from pathlib import Path

from google.cloud.exceptions import NotFound

from core.adapters.object_storage.gcs import GCSStorageAdapter
from core.config.storage import StorageOptions

# Configure logging for this test module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_gcs_adapter() -> bool:
    """Test the GCS storage adapter functionality."""
    try:
        # Create storage options for testing
        options = StorageOptions(
            BUCKET_NAME="test-bucket",  # Replace with your actual bucket name
            BASE_PATH="test/",
        )

        # Initialize the adapter
        adapter = GCSStorageAdapter("test-storage")
        adapter.options = options

        # Test content
        test_content = b"GCS adapter test file content"
        test_filename = f"test_gcs_{int(time.time())}.txt"
        remote_path = f"test/{test_filename}"

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(test_content)
            temp_file_path = Path(temp_file.name)

        try:
            # Test upload
            logger.info("Uploading to GCS: %s", remote_path)
            adapter.upload_file(str(temp_file_path), remote_path, prefer_async=False)

            # Test retrieve
            logger.info("Retrieving from GCS: %s", remote_path)
            _ = adapter.get_object(remote_path)

            # Test listing
            logger.info("Listing files in test/ directory...")
            files = adapter.list_files("test/")
            logger.info("Found files: %s", files)

            # Test path exists
            exists = adapter.path_exists(remote_path)
            logger.info("File exists: %s", exists)

            logger.info("GCS Adapter: PASSED")
            return True

        finally:
            # Clean up local file
            temp_file_path.unlink(missing_ok=True)

            # Clean up remote file (optional)
            try:
                adapter.delete_object(remote_path)
                logger.info("Cleaned up remote file: %s", remote_path)
            except NotFound:
                logger.info(
                    "Remote file %s was already deleted or not found",
                    remote_path,
                )

    except Exception:
        logger.exception("GCS Adapter: ERROR")
        return False


if __name__ == "__main__":
    """Run the test if executed directly."""
    success = test_gcs_adapter()
    sys.exit(0 if success else 1)
