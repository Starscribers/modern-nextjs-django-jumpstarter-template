from __future__ import annotations

from enum import Flag
from typing import Self

from django.db import models
from rest_framework import serializers


class PriorityField(serializers.IntegerField):
    """
    if priority is 0, set to DEFAULT_PRIORITY
    if priority exceed MAX_PRIORITY, raise validation error

    when response data, if priority is DEFAULT_PRIORITY, set to 0
    """

    def __init__(
        self: Self,
        *args: tuple,
        max_priority: int = 999,
        default_priority: int = 9999,
        **kwargs: dict,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.max_priority = max_priority
        self.default_priority = default_priority
        self.max_value = max_priority

    def to_representation(self: Self, value: int) -> int:
        value = super().to_representation(value)
        if value == self.default_priority:
            return 0

        return value

    def to_internal_value(self: Self, data: int) -> int:
        data = super().to_internal_value(data)
        if data == 0:
            return self.default_priority

        if data > self.max_priority:
            msg = f"priority should be less than {self.max_priority}"
            raise serializers.ValidationError(
                msg,
            )
        return data


class BitFlagField(models.PositiveIntegerField):
    """Custom model field to handle bitwise flag operations."""

    def to_python(self: Self, value: int) -> Flag:
        """Convert the stored value (integer) to a bitwise flag."""
        return Flag(value)

    def get_prep_value(self: Self, value: Flag) -> int:
        """Prepare the value before saving to the database."""
        return value.value if isinstance(value, Flag) else value
