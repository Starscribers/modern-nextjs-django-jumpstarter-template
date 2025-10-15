from typing import Any

from django.conf import settings
from rest_framework import serializers

from .models import ImageModel


class ImageModelSerializer(serializers.ModelSerializer):
    """Serializer for ImageModel."""

    url = serializers.ReadOnlyField()
    thumbnail_url = serializers.ReadOnlyField()
    absolute_url = serializers.ReadOnlyField()
    absolute_thumbnail_url = serializers.ReadOnlyField()
    original_image = serializers.SerializerMethodField()
    optimized_image = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = ImageModel
        fields = [
            "id",
            "title",
            "alt_text",
            "description",
            "image_type",
            "original_image",
            "optimized_image",
            "thumbnail",
            "url",
            "thumbnail_url",
            "absolute_url",
            "absolute_thumbnail_url",
            "width",
            "height",
            "file_size",
            "file_format",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "optimized_image",
            "thumbnail",
            "width",
            "height",
            "file_size",
            "file_format",
            "created_at",
            "updated_at",
        ]

    def get_original_image(self, obj: ImageModel) -> str | None:
        """Return URL for original image (relative by default, absolute if requested)."""
        if obj.original_image:
            # Check if absolute URLs are requested via context
            use_absolute = self.context.get("use_absolute_urls", False)
            if use_absolute:
                request = self.context.get("request")
                if request:
                    return request.build_absolute_uri(obj.original_image.url)
                else:
                    base_url = getattr(settings, "BASE_URL", "http://localhost:8000")
                    return f"{base_url}{obj.original_image.url}"
            return obj.original_image.url
        return None

    def get_optimized_image(self, obj: ImageModel) -> str | None:
        """Return URL for optimized image (relative by default, absolute if requested)."""
        if obj.optimized_image:
            # Check if absolute URLs are requested via context
            use_absolute = self.context.get("use_absolute_urls", False)
            if use_absolute:
                request = self.context.get("request")
                if request:
                    return request.build_absolute_uri(obj.optimized_image.url)
                else:
                    base_url = getattr(settings, "BASE_URL", "http://localhost:8000")
                    return f"{base_url}{obj.optimized_image.url}"
            return obj.optimized_image.url
        return None

    def get_thumbnail(self, obj: ImageModel) -> str | None:
        """Return URL for thumbnail (relative by default, absolute if requested)."""
        if obj.thumbnail:
            # Check if absolute URLs are requested via context
            use_absolute = self.context.get("use_absolute_urls", False)
            if use_absolute:
                request = self.context.get("request")
                if request:
                    return request.build_absolute_uri(obj.thumbnail.url)
                else:
                    base_url = getattr(settings, "BASE_URL", "http://localhost:8000")
                    return f"{base_url}{obj.thumbnail.url}"
            return obj.thumbnail.url
        return None


class ImageUploadSerializer(serializers.ModelSerializer):
    """Simplified serializer for image uploads."""

    class Meta:
        model = ImageModel
        fields = ["original_image", "title", "alt_text", "image_type", "id"]
        read_only_fields = ["id"]

    def create(self, validated_data: Any) -> ImageModel:
        # Set the uploaded_by field to the current user
        validated_data["uploaded_by"] = self.context["request"].user
        return super().create(validated_data)
