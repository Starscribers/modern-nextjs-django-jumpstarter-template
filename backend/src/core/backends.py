"""
Custom backends and filters for rest framework
"""

from __future__ import annotations

import traceback
from typing import TYPE_CHECKING, Self

from django.core.exceptions import ValidationError
from django_filters import rest_framework as filters
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.exceptions import ValidationError as RestValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView, exception_handler

from .definitions import ErrorCode
from .exceptions import (
    ErrorCodeBoundError,
)
from .utils import camel_case, logger, snake_case

if TYPE_CHECKING:
    from django.db.models import QuerySet
    from django_filters import Filter


class PageSizePageNumberPagination(PageNumberPagination):
    """
    Override the default page size parameter name.
    """

    page_query_description = "查詢結果的分頁頁碼"
    page_size_query_description = "每頁要回傳的查詢結果數量"
    page_size_query_param = "size"
    page_size = 1000


class SortingFilter(OrderingFilter):
    """
    Use field:asc or field:desc to sort the queryset.
    """

    ordering_param = "sort"
    ordering_description = "用來排序的欄位"

    def get_ordering(
        self: Self,
        request: Request,
        queryset: QuerySet,
        view: APIView,
    ) -> list[str]:
        sort = request.query_params.get("sort")
        sort_list: list[str] = []

        if sort:
            for sort_item in sort.split(","):
                ordering = sort_item.split(":")
                field = snake_case(ordering[0])
                splited_ordering_len = 2
                if len(ordering) == splited_ordering_len:
                    field = field if ordering[1] == "asc" else "-" + field
                sort_list.append(field)
            return sort_list
        return super().get_ordering(request, queryset, view)


def _wrap_rest_validation_message(exc: RestValidationError) -> str:
    detail = ""
    if isinstance(exc.detail, list):
        for item in exc.detail:
            detail += str(item) + " "
        return detail

    for key, value in exc.detail.items():
        field_detail = f"{key}: "

        for item in value:
            field_detail += str(item)

        detail += field_detail + " "
    return detail


def generic_exception_handler(  # noqa: C901
    exc: Exception,
    context: dict,
) -> Response:
    """
    Wrap the default exception handler to handle custom exceptions.
    """
    response = exception_handler(exc, context)
    if isinstance(exc, ValidationError):
        response = Response(
            data={"detail": str(exc), **ErrorCode.INVALID_PARAMETER},
            status=400,
        )

    elif isinstance(exc, ErrorCodeBoundError):
        response = Response(
            data={"detail": str(exc), **exc.error_code},
            status=400,
        )

    elif isinstance(exc, AuthenticationFailed):
        if str(exc) == "No active account found with the given credentials":
            response = Response(
                data={"detail": str(exc), **ErrorCode.LOGIN_FAILED},
                status=400,
            )

    elif isinstance(exc, RestValidationError):
        detail = _wrap_rest_validation_message(exc)
        response = Response(
            data={"detail": detail, **ErrorCode.INVALID_PARAMETER},
            status=400,
        )

    elif type(exc).__name__ == "DoesNotExist":
        response = Response(
            data={"detail": str(exc), **ErrorCode.CONTENT_NOT_EXISTS},
            status=400,
        )

    # IntegrityError
    elif type(exc).__name__ == "IntegrityError":
        response = Response(
            data={"detail": str(exc), **ErrorCode.CONTENT_ALREADY_EXISTS},
            status=400,
        )

    # Too many failed login attempts
    elif (
        type(exc).__name__ == "PermissionDenied"
        and str(exc) == "Too many failed login attempts"
    ):
        response = Response(
            data={"detail": str(exc), **ErrorCode.TOO_MANY_ATTEMPTS},
            status=400,
        )

    elif type(exc).__name__ == "PermissionDenied":
        response = Response(
            data={"detail": "Permission Denied", "message": str(exc)},
            status=403,
        )

    elif type(exc).__name__ == "ProgrammingError":
        response = Response(
            data={
                "detail": "Database error, please contact the administrator",
                **ErrorCode.DB_ERROR,
            },
            status=400,
        )
        logger.error(traceback.format_exc())

    return response


def trans_field_to_camel_case(
    filter_field: Filter,
    lookup: str,
    view: APIView,
    transformed_name: str,
) -> None:
    # trans request.GET to camel case
    original_name = (
        f"{filter_field.field_name}:{lookup}"
        if lookup not in ["exact", "in"]
        else filter_field.field_name
    )
    if snake_case(original_name) in view.request.GET:
        view.request.GET[transformed_name] = view.request.GET[snake_case(original_name)]

    if original_name in view.request.GET:
        view.request.GET[transformed_name] = view.request.GET[original_name]


class CustomDjangoFilterBackend(filters.DjangoFilterBackend):
    """
    Wrap field_name__gte to fieldName:gte
    """

    def get_filterset_class(
        self: Self,
        view: APIView,
        queryset: QuerySet | None = None,
    ) -> type[filters.FilterSet | None]:
        filterset_class = super().get_filterset_class(view, queryset)

        if filterset_class is not None:
            updated_filters = {}

            for filter_field in filterset_class.base_filters.values():
                field_name = camel_case(filter_field.field_name)
                lookup = filter_field.lookup_expr
                if lookup in ["exact", "in"]:
                    transformed_name = field_name
                else:
                    transformed_name = f"{field_name}:{lookup}"
                updated_filters[transformed_name] = filter_field
                trans_field_to_camel_case(filter_field, lookup, view, transformed_name)

            filterset_class.base_filters = updated_filters

        return filterset_class


class CustomSearchFilter(SearchFilter):
    search_description = "搜尋關鍵字"
