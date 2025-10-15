from typing import Self

from core.config.storage import StorageOptions


class StorageAdapter:
    sync_adaptee_class: type | None = None
    async_adaptee_class: type | None = None

    def __init__(
        self: Self,
        storage_name: str,
    ) -> None:
        self.storage_name = storage_name
        self.options = StorageOptions(_env_prefix=storage_name.upper() + "_")
        self.sync_adaptee = self.sync_adaptee_class(self.options)  # type:ignore[misc]
        self.async_adaptee = (
            self.async_adaptee_class(self.options) if self.async_adaptee_class else None
        )
