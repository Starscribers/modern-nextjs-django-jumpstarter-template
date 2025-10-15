from __future__ import annotations

import enum
from types import DynamicClassAttribute
from typing import ClassVar, Self

from django.db import models
from django.utils.functional import classproperty

from core.utils import zip_by_first_iterable

__all__ = [
    "ModuleChoices",
    "QuadrupleTextChoices",
    "TriplexIntegerChoices",
    "TriplexTextChoices",
]


class InvalidValueTypeError(TypeError):
    """Custom exception for invalid value types in MultipleChoicesMeta."""


def create_class_property(field_name: str) -> classproperty:
    @classproperty
    def _prop(cls: type) -> list[str]:
        return [
            getattr(member, f"_{field_name}_") for member in cls.__members__.values()
        ]

    return _prop


def create_dynamic_class_attribute(field_name: str) -> DynamicClassAttribute:
    @DynamicClassAttribute
    def _prop(self: Self) -> str:
        return getattr(self, f"_{field_name}_", None)

    return _prop


class MultipleChoicesMeta(enum.EnumMeta):
    """
    A metaclass for creating a enum choices.

    first two values are set to be value and label to conform to Django's CharField choices requirements

    Disclaimer:
    1. this metaclass is designed for values count more than 2, if any less, seek Enum or TextChoices for better fit
    2. while Inheriting EnumMeta, Promises are not supported due to simplicity
    3. at least one value is expected
    """

    reserved_field_names: ClassVar[set] = {"value", "label", "name"}

    def __new__(
        metacls: type,
        classname: str,
        bases: tuple,
        classdict: dict,
        **kwds: dict,
    ) -> type:
        extra_field_names = metacls.find_extra_field_names(bases, classdict)

        if set(extra_field_names) & metacls.reserved_field_names:
            error_message = (
                f"Field names {extra_field_names} are reserved and cannot be used."
            )
            raise InvalidValueTypeError(error_message)

        field_names: tuple = ("value", "label", *extra_field_names)
        field_names_mapping: dict[str, list] = {name: [] for name in field_names}
        for key in classdict._member_names:  # noqa: SLF001
            value = classdict[key]
            if isinstance(value, list | tuple):
                for field, item in zip_by_first_iterable(field_names, value):
                    field_names_mapping[field].append(item)
            elif isinstance(value, str):
                field_names_mapping[field_names[0]].append(value)
                for field in field_names[1:]:
                    field_names_mapping[field].append("")
            else:
                error_message = f"Invalid value type for {key}: {type(value)}"
                raise InvalidValueTypeError(error_message)

            # Use dict.__setitem__() to suppress defenses against double
            # assignment in enum's classdict.
            current_value = field_names_mapping[field_names[0]][-1]
            dict.__setitem__(classdict, key, current_value)
        cls = super().__new__(metacls, classname, bases, classdict, **kwds)

        # Set private attributes for the member
        metacls.set_member_private_attributes(cls, field_names, field_names_mapping)

        # Set class instance dynamic attributes for the member
        metacls.set_class_instance_dynamic_attributes(cls, field_names)

        # Set class properties for the member
        metacls.set_class_properties(cls, field_names)

        return enum.unique(cls)

    def __init__(cls: type, *args: tuple, **kwargs: dict) -> None:
        """
        Initialize the class.
        """
        super().__init__(*args, **kwargs)

    @staticmethod
    def find_extra_field_names(superclasses: tuple, classdict: dict) -> tuple[str]:
        """
        Find extra field names from superclasses.
        """
        extra_field_names = classdict.get("__extra_field_names__")
        if extra_field_names is None:
            for superclass in superclasses:
                if hasattr(superclass, "__extra_field_names__"):
                    extra_field_names = superclass.__extra_field_names__
                    break

        if extra_field_names is None:
            extra_field_names = ()
        elif isinstance(extra_field_names, str):
            extra_field_names = (extra_field_names,)

        return extra_field_names

    @staticmethod
    def set_member_private_attributes(
        target_cls: Self,
        field_names: tuple[str],
        field_names_mapping: dict[str, list[str]],
    ) -> None:
        """
        Set private attributes for the member.
        """
        for index, member in enumerate(target_cls.__members__.values()):
            for field_name in field_names:
                value = field_names_mapping[field_name][index]
                setattr(member, f"_{field_name}_", value)

    @staticmethod
    def set_class_instance_dynamic_attributes(
        target_cls: Self,
        field_names: tuple[str],
    ) -> None:
        """
        Set class instance dynamic attributes for the member.
        """
        for field_name in field_names:
            attr_func = create_dynamic_class_attribute(field_name)
            setattr(target_cls, field_name, attr_func)

    @staticmethod
    def set_class_properties(target_cls: Self, field_names: tuple[str]) -> None:
        """
        Set class properties for the member.
        """
        for field_name in field_names:
            prop_func = create_class_property(field_name)
            setattr(target_cls, f"{field_name}s", prop_func)

    def __contains__(cls, member: object) -> bool:
        if not isinstance(member, enum.Enum):
            # Allow non-enums to match against member values.
            return any(x.value == member for x in cls)
        return super().__contains__(member)

    @property
    def names(cls) -> list[str]:
        empty = ["__empty__"] if hasattr(cls, "__empty__") else []
        return empty + [member.name for member in cls]

    @property
    def choices(cls) -> list[tuple]:
        empty = [(None, cls.__empty__)] if hasattr(cls, "__empty__") else []
        return empty + [(member.value, member.label) for member in cls]


class MultipleChoices(enum.Enum, metaclass=MultipleChoicesMeta):
    """Class for creating enumerated choices."""

    @property
    def do_not_call_in_templates(self: Self) -> bool:
        return True

    def __str__(self: Self) -> str:
        """
        Use value when cast to str, so that Choices set as model instance
        attributes are rendered as expected in templates and similar contexts.
        """
        return str(self.value)

    def __repr__(self: Self) -> str:
        return f"{self.__class__.__qualname__}.{self._name_}"


class TriplexChoices(MultipleChoices):
    """Class for creating enumerated choices."""

    __extra_field_names__ = "extra"  # use dunder to avoid Enum field name confusion


class TriplexTextChoices(str, TriplexChoices):
    """Class for creating enumerated string choices.

    and for the choice to be evaluated as string type when needed
    i.e. TriplexTextChoices.EXAMPLE == "example" # True
    """


class TriplexIntegerChoices(int, TriplexChoices):
    """Class for creating enumerated integer choices.

    and for the choice to be evaluated as int type when needed
    i.e. TriplexIntegerChoices.EXAMPLE == 1 # True
    """


class QuadrupleChoices(MultipleChoices):
    """Class for creating enumerated choices with four fields."""

    __extra_field_names__ = ("extra", "more")


class QuadrupleTextChoices(str, QuadrupleChoices):
    """Class for creating enumerated string choices."""


class QuintupleChoices(MultipleChoices):
    """Class for creating enumerated choices with five fields."""

    __extra_field_names__ = ("extra", "more", "even_more")


class ModuleChoices(models.TextChoices):
    DATAHUB = "datahub", "數據管理"
    AUDIENCE = "audience", "受眾篩選"
    CAMPAIGN = "campaign", "行銷活動"
    ASSET = "asset", "素材管理"
    JOURNEY = "journey", "智能營運"
    PERMISSION = "permission", "權限管理"
    NOTIFICATION = "notification", "通知中心"
    GENERAL = "general", "平台設定"

    @property
    def context(self: Self) -> tuple[str]:
        """
        return the value and label of the enum member
        """
        return (self.value, self.label)
