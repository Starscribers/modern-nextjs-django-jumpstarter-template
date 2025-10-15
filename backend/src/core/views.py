import time
from typing import Any

from django.conf import settings
from django.db import connection
from django.http import Http404
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ImageModel
from .serializers import ImageModelSerializer, ImageUploadSerializer


class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        """Return health status of the application."""
        health_status: dict[str, Any] = {
            "status": "healthy",
            "timestamp": time.time(),
            "version": "1.0.0",
            "environment": "development" if settings.DEBUG else "production",
        }

        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            health_status["database"] = "connected"
        except Exception as e:
            health_status["database"] = f"error: {str(e)}"
            health_status["status"] = "unhealthy"

        response_status = (
            status.HTTP_200_OK
            if health_status["status"] == "healthy"
            else status.HTTP_503_SERVICE_UNAVAILABLE
        )

        return Response(health_status, status=response_status)


class ImageUploadView(generics.CreateAPIView):
    """
    Generic image upload view.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = ImageUploadSerializer


class ImageDetailView(APIView):
    """
    Image detail view for getting, updating, and deleting images.
    """

    permission_classes = [IsAuthenticated]

    def get_object(self, pk: int) -> ImageModel:
        """Get image object or raise 404."""
        try:
            return ImageModel.objects.get(pk=pk)
        except ImageModel.DoesNotExist as e:
            raise Http404 from e

    def get(self, request: Request, pk: int) -> Response:
        """Get image details."""
        image = self.get_object(pk)
        serializer = ImageModelSerializer(image)
        return Response(serializer.data)

    def delete(self, request: Request, pk: int) -> Response:
        """Delete an image (only by owner or staff)."""
        image = self.get_object(pk)

        # Check permissions
        if not (
            request.user == image.uploaded_by
            or (hasattr(request.user, "is_staff") and request.user.is_staff)
        ):
            return Response(
                {"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN
            )

        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserImagesView(APIView):
    """
    View for listing user's uploaded images.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """Get all images uploaded by the current user."""
        images = ImageModel.objects.filter(uploaded_by=request.user).order_by(
            "-created_at"
        )
        serializer = ImageModelSerializer(images, many=True)
        return Response(serializer.data)
