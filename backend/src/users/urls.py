from django.urls import path
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from . import views

urlpatterns = [
    # JWT Authentication (kept under /api/v1/auth/*)
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),
    # User management
    path("users/", views.UserViewSet.as_view(), name="users"),
    path("register/", views.UserRegistrationView.as_view(), name="user_register"),
    path(
        "profile/", views.CurrentUserProfileView.as_view(), name="current_user_profile"
    ),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change_password"
    ),
    # Enhanced profile and settings management
    path(
        "profile/detailed/",
        views.UserProfileManagementView.as_view(),
        name="user_profile_detailed",
    ),
    path(
        "profile/update/",
        views.UpdateUserBasicInfoView.as_view(),
        name="update_user_basic",
    ),
    path("profile/avatar/", views.AvatarUploadView.as_view(), name="avatar_upload"),
    path("settings/", views.UserSettingsView.as_view(), name="user_settings"),
    # Account management
    path("account/delete/", views.DeleteAccountView.as_view(), name="delete_account"),
    path(
        "account/export/", views.ExportUserDataView.as_view(), name="export_user_data"
    ),
    # Legacy endpoints
    path("profiles/", views.UserProfileViewSet.as_view(), name="user_profiles"),
]
