# GCP Cloud Storage Adapter

This directory contains the Google Cloud Storage (GCS) adapter implementation that mirrors the functionality of the existing S3StorageAdapter.

## Files

- `gcs.py` - Main GCS storage adapter that implements the `StorageAdapter` interface
- `gcs_file.py` - GCS file operations class, similar to `S3File`
- `async_gcs.py` - Asynchronous GCS operations, similar to `AsynchronousS3`
- `test_gcs.py` - Test file to verify the GCS adapter functionality

## Configuration

To use the GCS adapter instead of S3, you need to:

### 1. Environment Variables

Set the following environment variables:

```bash
# Google Cloud Project ID
GOOGLE_CLOUD_PROJECT=your-project-id

# Path to your service account key file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json

# Or use Application Default Credentials (ADC) if running on GCP
```

### 2. Update Storage Backend Configuration

In your settings or environment configuration, change the storage backend:

```python
# Instead of S3
FILESTORE_BACKEND = 'core.adapters.object_storage.s3.S3StorageAdapter'

# Use GCS
FILESTORE_BACKEND = 'core.adapters.object_storage.gcs.GCSStorageAdapter'
```

Or set environment variables:
```bash
FILESTORE_BACKEND=core.adapters.object_storage.gcs.GCSStorageAdapter
DATAHUB_BACKEND=core.adapters.object_storage.gcs.GCSStorageAdapter
IMAGE_BACKEND=core.adapters.object_storage.gcs.GCSStorageAdapter
```

### 3. Bucket Configuration

Set your GCS bucket names:

```bash
DATAHUB_BUCKET_NAME=your-datahub-bucket
FILESTORE_BUCKET_NAME=your-filestore-bucket
IMAGE_BUCKET_NAME=your-image-bucket
```

## Features

The GCS adapter provides the same functionality as the S3 adapter:

- ✅ File upload/download (sync and async)
- ✅ Folder upload/download
- ✅ Object storage operations (put/get JSON objects)
- ✅ File listing and path existence checking
- ✅ Presigned URL generation
- ✅ Django storage backend integration
- ✅ UUID-based file naming to prevent overwrites

## Testing

To test the GCS adapter:

1. Set up your GCS credentials
2. Create a test bucket
3. Run the test:

```bash
python -m core.adapters.object_storage.test_gcs
```

Or integrate with the existing dependency test system:

```bash
python manage.py testdeps --test filestorage
```

## Authentication

The GCS adapter supports multiple authentication methods:

1. **Service Account Key File**: Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your service account key file
2. **Application Default Credentials (ADC)**: If running on GCP, the adapter will automatically use the service account attached to the compute instance
3. **Google Cloud SDK**: If you have the Google Cloud SDK installed and authenticated

## Migration from S3

To migrate from S3 to GCS:

1. Set up your GCS buckets
2. Update your environment configuration to use the GCS adapter
3. Optionally, migrate existing files from S3 to GCS using the transfer operations
4. Test thoroughly in a staging environment before switching production

## API Compatibility

The GCS adapter implements the same interface as the S3 adapter, so no code changes are required in your application logic. All methods return the same data structures and behave identically.

## Dependencies

The GCS adapter requires:
- `google-cloud-storage>=3.1.0,<4` (already included in pyproject.toml)
- `django-storages` for Django integration

## Error Handling

The adapter handles common GCS exceptions and maps them to consistent behavior:
- File not found exceptions are handled gracefully
- Network timeouts and retries are managed by the Google Cloud client library
- Authentication errors are propagated with clear error messages
