from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model for example_project platform.
    Supports both learners and providers (teachers).
    """

    nickname: models.CharField = models.CharField(max_length=200, blank=True)

    bio: models.TextField = models.TextField(
        max_length=500, blank=True, help_text=_("User biography")
    )

    avatar_image: models.ForeignKey = models.ForeignKey(
        "core.ImageModel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="user_avatars",
        help_text=_("User profile picture"),
    )

    date_of_birth: models.DateField = models.DateField(
        null=True, blank=True, help_text=_("User date of birth")
    )

    preferred_language: models.CharField = models.CharField(
        max_length=10, default="en", help_text=("User preferred language code")
    )

    # Preferences
    email_notifications: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Receive email notifications")
    )

    public_profile: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Make profile publicly visible")
    )

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return f"{self.username} ({self.email})"


class UserProfile(models.Model):
    """
    Extended user profile information.
    """

    class SkillLevel(models.TextChoices):
        BEGINNER = "beginner", _("Beginner")
        INTERMEDIATE = "intermediate", _("Intermediate")
        ADVANCED = "advanced", _("Advanced")
        EXPERT = "expert", _("Expert")

    user: models.OneToOneField = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )

    # Learning preferences for learners
    learning_goals: models.TextField = models.TextField(
        blank=True, help_text=_("User learning goals and objectives")
    )

    skill_level: models.CharField = models.CharField(
        max_length=20,
        choices=SkillLevel.choices,
        default=SkillLevel.BEGINNER,
        help_text=_("Overall skill level"),
    )

    # Provider-specific information
    teaching_experience: models.PositiveIntegerField = models.PositiveIntegerField(
        null=True, blank=True, help_text=_("Years of teaching experience")
    )

    expertise_areas: models.JSONField = models.JSONField(
        default=list, blank=True, help_text=_("Areas of expertise (for providers)")
    )

    certifications: models.JSONField = models.JSONField(
        default=list, blank=True, help_text=_("Professional certifications")
    )

    # Analytics and tracking
    timezone: models.CharField = models.CharField(
        max_length=50, default="UTC", help_text=_("User timezone")
    )

    last_active: models.DateTimeField = models.DateTimeField(
        null=True, blank=True, help_text=_("Last activity timestamp")
    )

    total_learning_time: models.DurationField = models.DurationField(
        default=timedelta(0),  # Default to 0 seconds
        help_text=_("Total time spent learning"),
    )

    # Streak tracking
    current_streak: models.PositiveIntegerField = models.PositiveIntegerField(
        default=0, help_text=_("Current consecutive days of activity")
    )
    longest_streak: models.PositiveIntegerField = models.PositiveIntegerField(
        default=0, help_text=_("Longest streak ever achieved")
    )
    last_activity_date: models.DateField = models.DateField(
        null=True, blank=True, help_text=_("Date of last recorded activity")
    )
    streak_start_date: models.DateField = models.DateField(
        null=True, blank=True, help_text=_("When current streak began")
    )

    # Inventory slot limits (category-specific)
    material_slots: models.PositiveIntegerField = models.PositiveIntegerField(
        default=10, help_text=_("Maximum material item slots")
    )
    tool_slots: models.PositiveIntegerField = models.PositiveIntegerField(
        default=10, help_text=_("Maximum tool item slots")
    )
    consumable_slots: models.PositiveIntegerField = models.PositiveIntegerField(
        default=10, help_text=_("Maximum consumable item slots")
    )
    equipment_slots: models.PositiveIntegerField = models.PositiveIntegerField(
        default=10, help_text=_("Maximum equipment item slots")
    )
    learning_slots: models.PositiveIntegerField = models.PositiveIntegerField(
        default=10, help_text=_("Maximum learning item slots")
    )

    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"
        verbose_name = _("User Profile")
        verbose_name_plural = _("User Profiles")

    def __str__(self):
        return f"{self.user.username}'s Profile"


class UserSettings(models.Model):
    """
    User application settings and preferences.
    """

    class PreferredDifficulty(models.TextChoices):
        BEGINNER = "beginner", _("Beginner")
        INTERMEDIATE = "intermediate", _("Intermediate")
        ADVANCED = "advanced", _("Advanced")
        MIXED = "mixed", _("Mixed Difficulty")

    class Theme(models.TextChoices):
        LIGHT = "light", _("Light")
        DARK = "dark", _("Dark")
        SYSTEM = "system", _("System")

    user: models.OneToOneField = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="settings"
    )

    # Notification preferences
    email_notifications: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Receive email notifications")
    )

    push_notifications: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Receive push notifications")
    )

    course_reminders: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Receive course reminder notifications")
    )

    achievement_notifications: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Receive achievement notifications")
    )

    weekly_progress_emails: models.BooleanField = models.BooleanField(
        default=False, help_text=_("Receive weekly progress summary emails")
    )

    # Privacy settings
    public_profile: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Make profile publicly visible")
    )

    show_progress_publicly: models.BooleanField = models.BooleanField(
        default=False, help_text=_("Show learning progress publicly")
    )

    allow_messages: models.BooleanField = models.BooleanField(
        default=True, help_text=_("Allow other users to send messages")
    )

    # Learning preferences
    daily_goal_minutes: models.PositiveIntegerField = models.PositiveIntegerField(
        default=30, help_text=_("Daily learning goal in minutes")
    )

    preferred_difficulty: models.CharField = models.CharField(
        max_length=15,
        choices=PreferredDifficulty.choices,
        default=PreferredDifficulty.MIXED,
        help_text=_("Preferred content difficulty"),
    )

    auto_continue_courses: models.BooleanField = models.BooleanField(
        default=False, help_text=_("Automatically continue to next course")
    )

    # UI/UX preferences
    theme: models.CharField = models.CharField(
        max_length=10,
        choices=Theme.choices,
        default=Theme.SYSTEM,
        help_text=_("UI theme preference"),
    )

    language: models.CharField = models.CharField(
        max_length=10, default="en", help_text=_("Preferred language code")
    )

    reduced_motion: models.BooleanField = models.BooleanField(
        default=False, help_text=_("Reduce UI animations and motion")
    )

    # Content preferences
    content_categories: models.JSONField = models.JSONField(
        default=list, blank=True, help_text=_("Preferred content categories")
    )

    blocked_tags: models.JSONField = models.JSONField(
        default=list, blank=True, help_text=_("Blocked content tags")
    )

    # Timestamps
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_settings"
        verbose_name = _("User Settings")
        verbose_name_plural = _("User Settings")

    def __str__(self):
        return f"{self.user.username}'s Settings"


class UserActivityLog(models.Model):
    """
    Daily activity log for tracking user engagement and streak calculation.
    """

    user: models.ForeignKey = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_activity_logs"
    )
    date: models.DateField = models.DateField(help_text=_("Date of the activity"))
    activity_count: models.PositiveIntegerField = models.PositiveIntegerField(
        default=0, help_text=_("Number of activities performed on this date")
    )
    total_learning_time: models.DurationField = models.DurationField(
        default=timedelta(0),
        help_text=_("Total learning time accumulated on this date"),
    )
    completed_nodes: models.JSONField = models.JSONField(
        default=list,
        blank=True,
        help_text=_("List of skill node IDs completed on this date"),
    )
    completed_quests: models.JSONField = models.JSONField(
        default=list,
        blank=True,
        help_text=_("List of quest IDs completed on this date"),
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_activity_logs"
        verbose_name = _("User Activity Log")
        verbose_name_plural = _("User Activity Logs")
        unique_together = ("user", "date")
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["date"]),
        ]

    def __str__(self):
        return f"{self.user.username} activity on {self.date}: {self.activity_count} activities"
