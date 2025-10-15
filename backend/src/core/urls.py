from django.urls import path

from . import views

urlpatterns = [
    # Health check
    path("health/", views.HealthCheckView.as_view(), name="health_check"),
    # Activity tracking
    path("images/upload/", views.ImageUploadView.as_view(), name="image_upload"),
    path("images/<int:pk>/", views.ImageDetailView.as_view(), name="image_detail"),
    path("images/my/", views.UserImagesView.as_view(), name="user_images"),
]
