"""
Custom pagination classes for consistent API responses.
"""

from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class that always returns a consistent structure:
    {
        "results": [...],
        "next": "...",
        "previous": "...",
        "count": 123,
        "page": 1,
        "page_size": 20,
        "total_pages": 7
    }
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(
            OrderedDict(
                [
                    ("results", data),
                    ("next", self.get_next_link()),
                    ("previous", self.get_previous_link()),
                    ("count", self.page.paginator.count),
                    ("page", self.page.number),
                    ("page_size", self.page.paginator.per_page),
                    ("total_pages", self.page.paginator.num_pages),
                ]
            )
        )


class ConsistentListMixin:
    """
    Mixin to ensure all list views return paginated response structure,
    even when pagination is disabled or not needed.
    """

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Always use pagination for consistency
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # If no pagination is configured, create a paginated-like response
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            OrderedDict(
                [
                    ("results", serializer.data),
                    ("next", None),
                    ("previous", None),
                    ("count", len(serializer.data)),
                    ("page", 1),
                    ("page_size", len(serializer.data)),
                    ("total_pages", 1),
                ]
            )
        )
