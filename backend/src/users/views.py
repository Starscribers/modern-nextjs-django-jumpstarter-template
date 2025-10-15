from typing import Any, cast

from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import ImageUploadSerializer

from .models import (
    User,
    UserProfile,
    UserSettings,
)
from .serializers import (
    ChangePasswordSerializer,
    UserProfileDetailSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserSettingsSerializer,
)


class UserRegistrationView(APIView):
    """User registration view."""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data

            try:
                # Create user with transaction to handle potential race conditions
                with transaction.atomic():
                    user = User.objects.create(
                        username=user_data["email"],
                        email=user_data["email"],
                        password=make_password(user_data["password"]),
                        nickname=user_data.get("nickname"),
                    )

                return Response(
                    {
                        "message": "User registered successfully",
                        "user_id": str(user.pk),
                    },
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                # Handle database integrity errors (e.g., unique constraint violations)
                error_message = str(e)
                if (
                    "unique constraint" in error_message.lower()
                    or "duplicate key" in error_message.lower()
                ):
                    if "email" in error_message.lower():
                        return Response(
                            {
                                "message": "Registration failed",
                                "errors": {
                                    "email": [
                                        "This email address is already registered. Please use a different email or try logging in instead."
                                    ]
                                },
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif "nickname" in error_message.lower():
                        return Response(
                            {
                                "message": "Registration failed",
                                "errors": {
                                    "nickname": [
                                        "This nickname is already taken. Please choose a different one."
                                    ]
                                },
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                # Generic error for other database issues
                return Response(
                    {
                        "message": "Registration failed",
                        "errors": {
                            "general": [
                                "An error occurred during registration. Please try again."
                            ]
                        },
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        # Return validation errors with proper field-level error structure
        return Response(
            {"message": "Registration failed", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CurrentUserProfileView(APIView):
    """Current user profile view."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request: Request) -> Response:
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvatarUploadView(APIView):
    """Avatar upload view for current user."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if "avatar" not in request.FILES:
            return Response(
                {"error": "No avatar file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        avatar_file = request.FILES["avatar"]

        # Validate file size (5MB limit)
        if avatar_file.size > 5 * 1024 * 1024:
            return Response(
                {"error": "File size too large. Maximum size is 5MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate file type
        if not avatar_file.content_type.startswith("image/"):
            return Response(
                {"error": "Invalid file type. Only image files are allowed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the image model with avatar data
        user = cast(User, request.user)  # Cast to our custom User model
        image_data: dict[str, Any] = {
            "original_image": avatar_file,
            "title": f"Avatar for {user.username}",
            "alt_text": f"Profile picture of {user.get_full_name() or user.username}",
            "image_type": "avatar",
        }

        # Create ImageModel instance
        image_serializer = ImageUploadSerializer(
            data=image_data, context={"request": request}
        )
        if image_serializer.is_valid():
            # Save the new image
            new_avatar = image_serializer.save()

            # Update user's avatar reference
            old_avatar = user.avatar_image
            user.avatar_image = new_avatar
            user.save()

            # Optionally delete the old avatar if it exists and is not being used elsewhere
            if (
                old_avatar
                and not User.objects.filter(avatar_image=old_avatar)
                .exclude(pk=user.pk)
                .exists()
            ):
                old_avatar.is_active = False  # type: ignore[attr-defined]
                old_avatar.save()  # type: ignore[attr-defined]

            # Return updated user data
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(generics.ListAPIView):
    """User management viewset."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class UserProfileViewSet(generics.ListCreateAPIView):
    """User profile management viewset."""

    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)


class ChangePasswordView(APIView):
    """Change password view."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            if not request.user.check_password(
                serializer.validated_data["old_password"]
            ):
                return Response(
                    {"error": "Old password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Set new password
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()

            return Response({"message": "Password changed successfully"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSettingsView(APIView):
    """User settings management view."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """Get user settings."""
        settings, created = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request: Request) -> Response:
        """Update user settings."""
        settings, created = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileManagementView(APIView):
    """Extended user profile management."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """Get detailed user profile."""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileDetailSerializer(profile)
        return Response(serializer.data)

    def put(self, request: Request) -> Response:
        """Update user profile."""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserBasicInfoView(APIView):
    """Update basic user information (name, email, etc.)."""

    permission_classes = [IsAuthenticated]

    def put(self, request: Request) -> Response:
        """Update basic user info."""
        serializer = UserSerializer(request.user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    """Account deletion view."""

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        """Delete user account (soft delete by deactivating)."""
        password = request.data.get("password")

        if not password:
            return Response(
                {"error": "Password confirmation required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.user.check_password(password):
            return Response(
                {"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Deactivate account instead of hard delete
        request.user.is_active = False
        request.user.save()

        return Response({"message": "Account successfully deactivated"})


class ExportUserDataView(APIView):
    """Export user data for GDPR compliance."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        """Export all user data."""
        user_data: dict[str, Any] = {
            "user": UserSerializer(request.user).data,
            "profile": UserProfileSerializer(
                getattr(request.user, "profile", None)
            ).data
            if hasattr(request.user, "profile")
            else None,
            "settings": UserSettingsSerializer(
                getattr(request.user, "settings", None)
            ).data
            if hasattr(request.user, "settings")
            else None,
        }

        return Response({"exported_at": timezone.now().isoformat(), "data": user_data})
