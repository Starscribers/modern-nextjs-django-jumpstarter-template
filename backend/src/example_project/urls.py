"""
URL configuration for example_project project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

# API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="example_project API",
        default_version="v1",
        description="",
        terms_of_service="https://www.example_project.com/terms/",
        contact=openapi.Contact(
            name="example_project API Support",
            email="api@example_project.com",
            url="https://www.example_project.com/support",
        ),
        license=openapi.License(
            name="MIT License", url="https://opensource.org/licenses/MIT"
        ),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # API Documentation
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path("swagger.json", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    # API Routes
    path("api/v1/auth/", include("users.urls")),  # Auth and user endpoints (scoped)
    # Starscriber API
    path("api/v1/", include("core.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
