from __future__ import annotations

import queue
import threading
import time
from pathlib import Path
from typing import TYPE_CHECKING, Any, Self

from google.cloud import storage

if TYPE_CHECKING:
    from collections.abc import Callable

    from core.config.storage import StorageOptions


class AsynchronousGCS:
    """Download/Upload asynchronously files from/to Google Cloud Storage bucket.

    Example:
    >>> from async_gcs import AsynchronousGCS
    >>>
    >>> def my_success_callback(size, duration):
    ...     print(f'My {size} bytes file has been uploaded in {duration} sec.')
    ...
    >>> def upload_to_gcs():
    ...     async_gcs = AsynchronousGCS('my-bucket-name')
    ...     async_gcs.upload_file(
    ...         'path/to_my/local_file',
    ...         'object/key',
    ...         on_success=my_success_callback,
    ...         on_failure=lambda error: print(error),
    ...     )
    ...     print('code to be executed...')
    ...
    >>> upload_file()
    code to be executed...
    My 105673 bytes file has been uploaded in 5.3242523 sec.
    >>>
    """

    def __init__(
        self: Self,
        storage_options: StorageOptions,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        """Class constructor.

        Arguments:
        storage_options -- Storage options containing bucket name and other config
        args -- extra arguments to give to google.cloud.storage.Client instance.

        Keywords arguments:
        kwargs -- extra kwargs to give to google.cloud.storage.Client instance.
        """
        self.client = storage.Client(*args, **kwargs)
        self.bucket = self.client.bucket(storage_options.BUCKET_NAME)
        self._io_threads_queue = threads_queue = queue.Queue()
        self._daemon = _GCSDaemon(threads_queue)
        self._daemon.start()

    def upload_file(
        self: Self,
        local_path: str,
        key: str,
        on_success: Callable[..., Any] | None = None,
        on_failure: Callable[..., Any] | None = None,
        **kwargs: Any,
    ) -> None:
        """Upload a file from your computer to GCS.

        Arguments:
        local_path -- Source path on your computer.
        key -- GCS destination object key.

        Keywords arguments:
        on_success -- success callback to call. Given arguments will be:
        file_size and duration. Default is `None`, no callback is called.
        on_failure -- failure callback to call. Given arguments will be:
        error_message. Default is `None`, no callback is called.
        kwargs -- Extra kwargs for upload operation.
        """
        blob = self.bucket.blob(key)

        def upload_method(filename: str, **upload_kwargs: Any) -> None:
            blob.upload_from_filename(filename, **upload_kwargs)

        thread = _GCSThread(
            upload_method,
            on_success=on_success,
            on_failure=on_failure,
            threads_queue=self._io_threads_queue,
            filename=local_path,
            **kwargs,
        )
        thread.start()

    def download_file(
        self: Self,
        key: str,
        local_path: str,
        on_success: Callable[..., Any] | None = None,
        on_failure: Callable[..., Any] | None = None,
        **kwargs: Any,
    ) -> None:
        """Download a file from GCS to your computer.

        Arguments:
        key -- GCS source object key.
        local_path -- Destination path on your computer.

        Keywords arguments:
        on_success -- success callback to call. Given arguments will be:
        file_size and duration. Default is `None`, no callback is called.
        on_failure -- failure callback to call. Given arguments will be:
        error_message. Default is `None`, no callback is called.
        kwargs -- Extra kwargs for download operation.
        """
        blob = self.bucket.blob(key)

        def download_method(filename: str, **download_kwargs: Any) -> None:
            blob.download_to_filename(filename, **download_kwargs)

        thread = _GCSThread(
            download_method,
            on_success=on_success,
            on_failure=on_failure,
            threads_queue=self._io_threads_queue,
            filename=local_path,
            **kwargs,
        )
        thread.start()

    def exit_(self: Self) -> None:
        """Exit the daemon thread."""
        self._daemon.exit_()

    def __del__(self: Self) -> None:
        self.exit_()


class _GCSThread(threading.Thread):
    def __init__(
        self: Self,
        method: Callable[..., Any],
        threads_queue: queue.Queue[Any],
        on_success: Callable[..., Any] | None = None,
        on_failure: Callable[..., Any] | None = None,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        self._method = method
        self._on_success = on_success
        self._on_failure = on_failure
        self._threads_queue = threads_queue
        self._meth_args = args
        self._meth_kwargs = kwargs

        self._start_time = time.time()

        super().__init__()

    def run(self: Self) -> None:
        method = self._method
        args = self._meth_args
        kwargs = self._meth_kwargs

        try:
            method(*args, **kwargs)
            self.success()
        except Exception as error:
            self.failed(str(error))
            raise

    def success(self: Self) -> None:
        file_path = self._meth_kwargs["filename"]
        file_size = Path(file_path).stat().st_size
        duration = time.time() - self._start_time

        self.stop(self._on_success, file_size, duration)
        # delete file
        Path(file_path).unlink()

    def failed(self: Self, error_message: str) -> None:
        self.stop(self._on_failure, error_message)

    def stop(self: Self, callback: Callable[..., Any] | None, *args: Any) -> None:
        if callback is not None:
            callback(*args)

        self._threads_queue.put(self)


class _GCSDaemon(threading.Thread):
    def __init__(
        self: Self,
        threads_queue: queue.Queue[Any],
    ) -> None:
        self._threads_queue = threads_queue

        self._running_event = threading.Event()
        self._running_event.set()

        super().__init__(daemon=True)

    def run(self: Self) -> None:
        while self._running_event.is_set():
            time.sleep(0.1)

            try:
                thread = self._threads_queue.get_nowait()
            except queue.Empty:
                continue

            thread.join(0.2)

    def exit_(self: Self) -> None:
        self._running_event.clear()
        self.join(0.2)
