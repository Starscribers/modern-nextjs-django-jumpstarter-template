from __future__ import annotations

import os
import uuid
from io import BytesIO
from typing import Self

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.utils.translation import gettext_lazy as _
from PIL import Image


class BaseModel(models.Model):
    """
    Abstract base model with common fields.
    """

    id: models.UUIDField = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(models.Model):
    """
    Categories for organizing skill trees and content.
    """

    name: models.CharField = models.CharField(max_length=100, unique=True)
    slug: models.SlugField = models.SlugField(max_length=100, unique=True)
    description: models.TextField = models.TextField(blank=True)

    # Visual
    icon: models.CharField = models.CharField(
        max_length=50, blank=True, help_text=_("Icon identifier for the category")
    )

    color: models.CharField = models.CharField(
        max_length=7, default="#007bff", help_text=_("Hex color code for the category")
    )

    # Hierarchy
    parent: models.ForeignKey = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )

    # Metadata
    is_active: models.BooleanField = models.BooleanField(default=True)
    order: models.PositiveIntegerField = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "categories"
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ["order", "name"]

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


class Tag(models.Model):
    """
    Tags for flexible content categorization.
    """

    name: models.CharField = models.CharField(max_length=50, unique=True)
    slug: models.SlugField = models.SlugField(max_length=50, unique=True)
    description: models.TextField = models.TextField(blank=True)

    # Properties
    color: models.CharField = models.CharField(
        max_length=7, default="#6c757d", help_text=_("Hex color code for the tag")
    )

    is_featured: models.BooleanField = models.BooleanField(
        default=False, help_text=_("Whether this tag is featured in listings")
    )

    # Analytics
    usage_count: models.PositiveIntegerField = models.PositiveIntegerField(
        default=0, help_text=_("Number of times this tag is used")
    )

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tags"
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ["name"]

    def __str__(self):
        return self.name


class Notification(models.Model):
    """
    User notifications system.
    """

    NOTIFICATION_TYPES = [
        ("course_completed", _("Course Completed")),
        ("skill_tree_completed", _("Skill Tree Completed")),
        ("achievement_earned", _("Achievement Earned")),
        ("streak_milestone", _("Streak Milestone")),
        ("new_content", _("New Content Available")),
        ("reminder", _("Learning Reminder")),
        ("system", _("System Notification")),
    ]

    PRIORITY_LEVELS = [
        ("low", _("Low")),
        ("normal", _("Normal")),
        ("high", _("High")),
        ("urgent", _("Urgent")),
    ]

    id: models.UUIDField = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    user: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )

    # Content
    title: models.CharField = models.CharField(max_length=200)
    message: models.TextField = models.TextField()
    notification_type: models.CharField = models.CharField(
        max_length=20, choices=NOTIFICATION_TYPES, default="system"
    )

    # Properties
    priority: models.CharField = models.CharField(
        max_length=10, choices=PRIORITY_LEVELS, default="normal"
    )

    # Links and actions
    action_url: models.URLField = models.URLField(
        blank=True, help_text=_("URL to navigate when notification is clicked")
    )

    action_text: models.CharField = models.CharField(
        max_length=50, blank=True, help_text=_("Text for action button")
    )

    # Related objects
    related_object_type: models.CharField = models.CharField(
        max_length=50,
        blank=True,
        help_text=_("Type of related object (skill_tree, course, etc.)"),
    )

    related_object_id: models.UUIDField = models.UUIDField(
        null=True, blank=True, help_text=_("ID of related object")
    )

    # Status
    is_read: models.BooleanField = models.BooleanField(default=False)
    is_sent: models.BooleanField = models.BooleanField(default=False)

    # Delivery channels
    send_email: models.BooleanField = models.BooleanField(default=False)
    send_push: models.BooleanField = models.BooleanField(default=True)
    send_in_app: models.BooleanField = models.BooleanField(default=True)

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    read_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    sent_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications"
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username}: {self.title}"

    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            from django.utils import timezone

            self.is_read = True
            self.read_at = timezone.now()
            self.save()


class UserPreference(models.Model):
    """
    User preferences and settings.
    """

    user: models.OneToOneField = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="preferences"
    )

    difficulty_preference: models.CharField = models.CharField(
        max_length=15,
        choices=[
            ("beginner", _("Beginner")),
            ("intermediate", _("Intermediate")),
            ("advanced", _("Advanced")),
            ("mixed", _("Mixed")),
        ],
        default="mixed",
        help_text=_("Preferred difficulty level"),
    )

    # Notification preferences
    email_notifications: models.BooleanField = models.BooleanField(default=True)
    push_notifications: models.BooleanField = models.BooleanField(default=True)
    achievement_notifications: models.BooleanField = models.BooleanField(default=True)
    reminder_notifications: models.BooleanField = models.BooleanField(default=True)
    marketing_emails: models.BooleanField = models.BooleanField(default=False)

    # Learning reminders
    daily_reminder_enabled: models.BooleanField = models.BooleanField(default=False)
    daily_reminder_time: models.TimeField = models.TimeField(null=True, blank=True)
    weekly_summary_enabled: models.BooleanField = models.BooleanField(default=True)

    # Interface preferences
    theme: models.CharField = models.CharField(
        max_length=10,
        choices=[
            ("light", _("Light")),
            ("dark", _("Dark")),
            ("auto", _("Auto")),
        ],
        default="auto",
    )

    language: models.CharField = models.CharField(
        max_length=10, default="en", help_text=_("Preferred language code")
    )

    # Privacy settings
    public_profile: models.BooleanField = models.BooleanField(default=True)
    show_progress: models.BooleanField = models.BooleanField(default=True)
    show_achievements: models.BooleanField = models.BooleanField(default=True)

    # Data and analytics
    analytics_enabled: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Allow collection of learning analytics")
    )

    # Additional settings
    settings: models.JSONField = models.JSONField(
        default=dict, help_text=_("Additional user settings in JSON format")
    )

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_preferences"
        verbose_name = _("User Preference")
        verbose_name_plural = _("User Preferences")

    def __str__(self):
        return f"{self.user.username}'s Preferences"


class ActivityLog(models.Model):
    """
    Logs user activities for analytics and tracking.
    """

    ACTIVITY_TYPES = [
        ("login", _("User Login")),
        ("logout", _("User Logout")),
        ("course_started", _("Course Started")),
        ("course_completed", _("Course Completed")),
        ("quiz_attempted", _("Quiz Attempted")),
        ("skill_tree_enrolled", _("Skill Tree Enrolled")),
        ("skill_tree_completed", _("Skill Tree Completed")),
        ("achievement_earned", _("Achievement Earned")),
        ("profile_updated", _("Profile Updated")),
        ("content_created", _("Content Created")),
        ("content_updated", _("Content Updated")),
    ]

    id: models.UUIDField = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    user: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="activity_logs",
        null=True,
        blank=True,
    )

    # Activity details
    activity_type: models.CharField = models.CharField(
        max_length=30, choices=ACTIVITY_TYPES
    )

    description: models.CharField = models.CharField(
        max_length=200, help_text=_("Brief description of the activity")
    )

    # Context
    ip_address: models.GenericIPAddressField = models.GenericIPAddressField(
        null=True, blank=True
    )
    user_agent: models.TextField = models.TextField(blank=True)

    # Related objects
    related_object_type: models.CharField = models.CharField(
        max_length=50, blank=True, help_text=_("Type of related object")
    )

    related_object_id: models.UUIDField = models.UUIDField(
        null=True, blank=True, help_text=_("ID of related object")
    )

    # Additional data
    metadata: models.JSONField = models.JSONField(
        default=dict, help_text=_("Additional activity data")
    )

    # Timestamp
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "activity_logs"
        verbose_name = _("Activity Log")
        verbose_name_plural = _("Activity Logs")
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "activity_type"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"{username}: {self.activity_type} at {self.created_at}"


class SystemConfiguration(models.Model):
    """
    System-wide configuration settings.
    """

    key: models.CharField = models.CharField(max_length=100, unique=True)
    value: models.TextField = models.TextField()
    description: models.TextField = models.TextField(blank=True)

    # Type information
    value_type: models.CharField = models.CharField(
        max_length=20,
        choices=[
            ("string", _("String")),
            ("integer", _("Integer")),
            ("float", _("Float")),
            ("boolean", _("Boolean")),
            ("json", _("JSON")),
        ],
        default="string",
    )

    # Properties
    is_sensitive: models.BooleanField = models.BooleanField(
        default=False,
        help_text=_("Whether this setting contains sensitive information"),
    )

    is_active: models.BooleanField = models.BooleanField(default=True)

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "system_configurations"
        verbose_name = _("System Configuration")
        verbose_name_plural = _("System Configurations")
        ordering = ["key"]

    def __str__(self):
        return f"{self.key}: {self.value[:50]}..."

    def get_typed_value(self):
        """Return the value converted to its proper type."""
        if self.value_type == "integer":
            return int(self.value)
        elif self.value_type == "float":
            return float(self.value)
        elif self.value_type == "boolean":
            return self.value.lower() in ("true", "1", "yes")
        elif self.value_type == "json":
            import json

            return json.loads(self.value)
        else:
            return self.value


class ImageModel(BaseModel):
    """
    Centralized image model for all images in the system.
    Handles image processing, optimization, and metadata.
    """

    IMAGE_TYPE_CHOICES = [
        ("avatar", _("User Avatar")),
        ("skill_tree_thumbnail", _("Skill Tree Thumbnail")),
        ("course_image", _("Course Image")),
        ("achievement_icon", _("Achievement Icon")),
        ("general", _("General Image")),
    ]

    # Core fields
    title: models.CharField = models.CharField(
        max_length=200, help_text=_("Descriptive title for the image")
    )

    alt_text: models.CharField = models.CharField(
        max_length=255, help_text=_("Alternative text for accessibility")
    )

    description: models.TextField = models.TextField(
        blank=True, help_text=_("Optional description of the image")
    )

    # Image files
    original_image: models.ImageField = models.ImageField(
        upload_to="images/originals/", help_text=_("Original uploaded image")
    )

    optimized_image: models.ImageField = models.ImageField(
        upload_to="images/optimized/",
        blank=True,
        null=True,
        help_text=_("Optimized version of the image"),
    )

    thumbnail: models.ImageField = models.ImageField(
        upload_to="images/thumbnails/",
        blank=True,
        null=True,
        help_text=_("Thumbnail version of the image"),
    )

    # Metadata
    image_type: models.CharField = models.CharField(
        max_length=20,
        choices=IMAGE_TYPE_CHOICES,
        default="general",
        help_text=_("Type of image for categorization"),
    )

    file_size: models.PositiveIntegerField = models.PositiveIntegerField(
        null=True, blank=True, help_text=_("File size in bytes")
    )

    width: models.PositiveIntegerField = models.PositiveIntegerField(
        null=True, blank=True, help_text=_("Image width in pixels")
    )

    height: models.PositiveIntegerField = models.PositiveIntegerField(
        null=True, blank=True, help_text=_("Image height in pixels")
    )

    file_format: models.CharField = models.CharField(
        max_length=10, blank=True, help_text=_("Image file format (JPEG, PNG, etc.)")
    )

    # Upload tracking
    uploaded_by: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_images",
        help_text=_("User who uploaded this image"),
    )

    is_active: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Whether the image is active and available for use")
    )

    class Meta:
        db_table = "core_images"
        verbose_name = _("Image")
        verbose_name_plural = _("Images")
        indexes = [
            models.Index(fields=["image_type"]),
            models.Index(fields=["uploaded_by"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_image_type_display()})"

    def save(self, *args, **kwargs):
        """Override save to process image and create variants."""
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and self.original_image:
            self._process_image()

    def _process_image(self):
        """Process the uploaded image to create optimized and thumbnail versions."""
        try:
            # Check if the original image file exists
            if not self.original_image or not hasattr(self.original_image, "path"):
                return

            # Open the original image
            image = Image.open(self.original_image.path)

            # Store metadata
            self.width, self.height = image.size
            self.file_size = os.path.getsize(self.original_image.path)
            self.file_format = image.format.lower() if image.format else "unknown"

            # Create optimized version (max 1200px width, quality 85)
            optimized = self._create_optimized_image(image)
            if optimized:
                optimized_io = BytesIO()
                optimized.save(optimized_io, format="JPEG", quality=85, optimize=True)
                optimized_io.seek(0)

                filename = f"optimized_{self.id}.jpg"
                self.optimized_image.save(
                    filename, ContentFile(optimized_io.getvalue()), save=False
                )

            # Create thumbnail (300x300, square crop)
            thumbnail = self._create_thumbnail(image)
            if thumbnail:
                thumb_io = BytesIO()
                thumbnail.save(thumb_io, format="JPEG", quality=80, optimize=True)
                thumb_io.seek(0)

                filename = f"thumb_{self.id}.jpg"
                self.thumbnail.save(
                    filename, ContentFile(thumb_io.getvalue()), save=False
                )

            # Save the metadata updates
            self.save(
                update_fields=[
                    "width",
                    "height",
                    "file_size",
                    "file_format",
                    "optimized_image",
                    "thumbnail",
                ]
            )

        except Exception:
            # Log the error but don't fail the save
            import traceback

            traceback.print_exc()

    def _create_optimized_image(self, image):
        """Create an optimized version of the image."""
        # Convert to RGB if necessary
        if image.mode in ("RGBA", "LA", "P"):
            # Create white background for transparency
            bg = Image.new("RGB", image.size, (255, 255, 255))
            if image.mode == "P":
                image = image.convert("RGBA")
            bg.paste(image, mask=image.split()[-1] if image.mode == "RGBA" else None)
            image = bg

        # Resize if larger than 1200px width
        if image.width > 1200:
            ratio = 1200 / image.width
            new_height = int(image.height * ratio)
            image = image.resize((1200, new_height), Image.Resampling.LANCZOS)

        return image

    def _create_thumbnail(self, image):
        """Create a square thumbnail of the image."""
        # Convert to RGB if necessary
        if image.mode in ("RGBA", "LA", "P"):
            bg = Image.new("RGB", image.size, (255, 255, 255))
            if image.mode == "P":
                image = image.convert("RGBA")
            bg.paste(image, mask=image.split()[-1] if image.mode == "RGBA" else None)
            image = bg

        # Create square crop
        min_dimension = min(image.size)
        left = (image.width - min_dimension) // 2
        top = (image.height - min_dimension) // 2
        right = left + min_dimension
        bottom = top + min_dimension

        image = image.crop((left, top, right, bottom))
        image = image.resize((300, 300), Image.Resampling.LANCZOS)

        return image

    @property
    def url(self):
        """Return the best available image URL as relative URL."""
        if self.optimized_image and self.optimized_image.url:
            return self.optimized_image.url
        elif self.original_image and self.original_image.url:
            return self.original_image.url
        return None

    @property
    def thumbnail_url(self):
        """Return the thumbnail URL as relative URL."""
        if self.thumbnail and self.thumbnail.url:
            return self.thumbnail.url
        return self.url

    @property
    def absolute_url(self):
        """Return the best available image URL as absolute URL."""
        from django.conf import settings

        relative_url = self.url
        if relative_url:
            # Get the base URL from settings
            base_url = getattr(settings, "BASE_URL", "http://localhost:8000")
            if relative_url.startswith("/"):
                return f"{base_url}{relative_url}"
            else:
                return f"{base_url}/{relative_url}"
        return None

    @property
    def absolute_thumbnail_url(self):
        """Return the thumbnail URL as absolute URL."""
        from django.conf import settings

        relative_url = self.thumbnail_url
        if relative_url:
            # Get the base URL from settings
            base_url = getattr(settings, "BASE_URL", "http://localhost:8000")
            if relative_url.startswith("/"):
                return f"{base_url}{relative_url}"
            else:
                return f"{base_url}/{relative_url}"
        return self.absolute_url


class FixtureRevision(models.Model):
    """
    Model to track which fixture versions have been loaded.

    This prevents duplicate loading of the same fixture version
    and enables incremental fixture updates.
    """

    fixture_slug: models.CharField = models.CharField(
        max_length=255,
        help_text="Unique identifier for the fixture",
    )
    revision: models.IntegerField = models.IntegerField(
        help_text="Version number of the loaded fixture",
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "django_fixture_manager_revision"
        verbose_name = "Fixture Revision"
        verbose_name_plural = "Fixture Revisions"
        indexes = [
            models.Index(fields=["fixture_slug"]),
            models.Index(fields=["fixture_slug", "revision"]),
        ]

    def __str__(self: Self) -> str:
        return f"{self.fixture_slug} - v{self.revision}"
