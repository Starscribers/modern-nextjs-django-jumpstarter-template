from typing import Any

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from core.serializers import ImageModelSerializer

from .models import (
    User,
    UserActivityLog,
    UserProfile,
    UserSettings,
)


class UserSettingsSerializer(serializers.ModelSerializer):
    """Serializer for UserSettings model."""

    class Meta:
        model = UserSettings
        exclude = ["user", "created_at", "updated_at"]


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""

    user: serializers.StringRelatedField = serializers.StringRelatedField(
        read_only=True
    )

    class Meta:
        model = UserProfile
        fields = "__all__"


class UserActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for UserActivityLog model."""

    class Meta:
        model = UserActivityLog
        fields = [
            "id",
            "date",
            "activity_count",
            "total_learning_time",
            "completed_nodes",
            "completed_quests",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    profile = UserProfileSerializer(read_only=True)
    settings = UserSettingsSerializer(read_only=True)
    avatar = ImageModelSerializer(source="avatar_image", read_only=True)
    avatar_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_superuser",
            "bio",
            "avatar",
            "avatar_id",
            "date_of_birth",
            "preferred_language",
            "email_notifications",
            "public_profile",
            "date_joined",
            "last_login",
            "profile",
            "settings",
        ]
        read_only_fields = ["id", "username", "date_joined", "last_login"]

    def update(self, instance: User, validated_data: dict[str, Any]) -> User:
        # Handle avatar_id separately
        avatar_id = validated_data.pop("avatar_id", None)
        if avatar_id is not None:
            if avatar_id:
                # Verify the image exists and belongs to the user or is accessible
                from core.models import ImageModel

                try:
                    avatar = ImageModel.objects.get(id=avatar_id)
                    if avatar.uploaded_by == instance or avatar.image_type == "avatar":
                        instance.avatar_image = avatar
                except ImageModel.DoesNotExist:
                    pass
            else:
                instance.avatar_image = None

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class UserRegistrationSerializer(serializers.Serializer):
    """Serializer for user registration."""

    nickname = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_nickname(self, value: str) -> str:
        if User.objects.filter(nickname=value).exists():
            raise serializers.ValidationError(
                "This nickname is already taken. Please choose a different one."
            )
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email address is already registered. Please use a different email or try logging in instead."
            )
        return value


class UserProfileDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for UserProfile model."""

    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = "__all__"


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs: dict[str, Any]) -> dict[str, Any]:
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs
