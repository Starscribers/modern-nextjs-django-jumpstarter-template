from __future__ import annotations

import re
from typing import TYPE_CHECKING, Self

from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext as _
from rest_framework import serializers

from core.regex import find_parameters, parameter_regex

if TYPE_CHECKING:
    import datetime
    from collections.abc import Callable, Iterable

    from account.models import User
    from django.db.models.query import QuerySet


class CustomPasswordValidator:
    def __init__(
        self: Self,
        min_upper: int = 1,
        min_lower: int = 1,
        min_digits: int = 1,
    ) -> None:
        self.min_upper = min_upper
        self.min_lower = min_lower
        self.min_digits = min_digits

    def validate(
        self: Self,
        password: str,
        _user: User | None = None,
    ) -> None:
        if not re.search(r"[A-Z]", password):
            raise ValidationError(
                _(
                    "The password must contain at least"
                    "%(min_upper)d uppercase letter(s).",
                ),
                code="password_no_upper",
                params={"min_upper": self.min_upper},
            )
        if not re.search(r"[a-z]", password):
            raise ValidationError(
                _(
                    "The password must contain at least"
                    "%(min_lower)d lowercase letter(s).",
                ),
                code="password_no_lower",
                params={"min_lower": self.min_lower},
            )
        if not re.search(r"\d", password):
            raise ValidationError(
                _("The password must contain at least %(min_digits)d digit(s)."),
                code="password_no_digit",
                params={"min_digits": self.min_digits},
            )

    def get_help_text(self: Self) -> str:
        return _(
            "The password must contain at least %(min_upper)d uppercase letter(s), "
            "%(min_lower)d lowercase letter(s), and %(min_digits)d digit(s).",
        ) % {
            "min_upper": self.min_upper,
            "min_lower": self.min_lower,
            "min_digits": self.min_digits,
        }


def validate_image_size(width: int, height: int) -> Callable:
    def validator(image: int) -> None:
        image_width, image_height = get_image_dimensions(image)
        if not (width == image_width and height == image_height):
            raise serializers.ValidationError(
                [f"Size should be exact {width} x {height} pixels."],
            )

    return validator


def validate_time_in(time_list: list[datetime.time]) -> Callable:
    def validator(value: datetime.datetime) -> None:
        if value.time() not in time_list:
            time_list_str = ", ".join(map(str, time_list))
            msg = f"Time must be in {time_list_str}."
            raise serializers.ValidationError(msg)

    return validator


def validate_unique(values: list) -> None:
    if len(values) != len(set(values)):
        msg = "Elements must be unique."
        raise serializers.ValidationError(msg)


class ValidIdListValidator:
    requires_context = True

    def __init__(
        self: Self,
        queryset: QuerySet,
        lookup_field: str = "",
        lookup: str = "in",
    ) -> None:
        self.queryset = queryset
        self.lookup_field = lookup_field
        self.lookup = lookup

    def filter_queryset(
        self: Self,
        value: Iterable,
        serializer_field: str,
    ) -> QuerySet:
        if not self.lookup_field:
            self.lookup_field = serializer_field.source_attrs[-1]
        filter_field = f"{self.lookup_field}__{self.lookup}"
        return self.queryset.filter(**{filter_field: value})

    def __call__(
        self: Self,
        value: Iterable,
        serializer_field: serializers.Field,
    ) -> None:
        if len(value) != self.filter_queryset(value, serializer_field).count():
            msg = "Quantity does not match database."
            raise serializers.ValidationError(msg)


def validate_link_type(value: dict) -> None | serializers.ValidationError:
    from assets.models import LinkType

    link_type_generator = [link_type.value for link_type in LinkType]

    if "link_type" in value and value["link_type"] not in link_type_generator:
        link_type_str = ", ".join(map(str, link_type_generator))
        msg = f"link_type must be in {link_type_str}."
        raise serializers.ValidationError(msg)


@deconstructible
class WordCountWithParamsValidator:
    def __init__(
        self: Self,
        max_length: int,
        get_params_length: Callable | int,
        regex: str = parameter_regex,
    ) -> None:
        self.max_length = max_length
        self.get_params_length = get_params_length
        self.regex = regex

    def __call__(self: Self, value: str) -> None:
        parameters = find_parameters(value, self.regex)
        parameters_length = sum(
            [len(parameter) for parameter in parameters],
        )

        word_length = len(value) - parameters_length

        if isinstance(self.get_params_length, int):
            parameters_estimate_length = len(parameters) * self.get_params_length
        else:
            parameters_estimate_length = len(parameters) * self.get_params_length()

        if word_length + parameters_estimate_length > self.max_length:
            message = f"Maximum word count without parameters is {self.max_length}."
            raise ValidationError(message)

    def __eq__(
        self: Self,
        other: WordCountWithParamsValidator,
    ) -> bool:
        return (
            isinstance(other, WordCountWithParamsValidator)
            and self.max_length == other.max_length
            and self.regex == other.regex
            and self.get_params_length == other.get_params_length()
        )
