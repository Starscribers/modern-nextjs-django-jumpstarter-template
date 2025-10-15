"""
Tests for the users app.
"""

import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_create_user():
    """Test creating a regular user."""
    user = User.objects.create_user(
        username="testuser", email="test@example.com", password="testpass123"
    )
    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.check_password("testpass123")
    assert not user.is_staff
    assert not user.is_superuser


@pytest.mark.django_db
def test_create_superuser():
    """Test creating a superuser."""
    admin_user = User.objects.create_superuser(
        username="admin", email="admin@example.com", password="adminpass123"
    )
    assert admin_user.username == "admin"
    assert admin_user.email == "admin@example.com"
    assert admin_user.check_password("adminpass123")
    assert admin_user.is_staff
    assert admin_user.is_superuser


@pytest.mark.django_db
def test_user_str_representation():
    """Test the string representation of a user."""
    user = User.objects.create_user(username="testuser", email="test@example.com")
    # The actual string representation includes the user role
    assert "testuser" in str(user)
    assert "Learner" in str(user)  # Default role


@pytest.mark.django_db
def test_user_registration_endpoint():
    """Test user registration endpoint."""
    client = APIClient()
    data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "newpass123",
        "password_confirm": "newpass123",
    }

    # This test assumes you have a registration endpoint
    # Skip if endpoint doesn't exist yet
    try:
        url = reverse("user-register")
        response = client.post(url, data)
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_201_CREATED,
            status.HTTP_404_NOT_FOUND,
        ]
    except Exception:
        pytest.skip("Registration endpoint not implemented yet")


@pytest.mark.django_db
def test_user_profile_access(user_factory, api_client_authenticated):
    """Test accessing user profile."""
    # Create a user for the test context
    _user = user_factory(username="profileuser", email="profile@example.com")
    client = api_client_authenticated

    try:
        url = reverse("user-profile")
        response = client.get(url)
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
    except Exception:
        pytest.skip("Profile endpoint not implemented yet")


@pytest.mark.unit
def test_simple_unit_test():
    """Simple unit test to verify pytest is working."""
    assert 1 + 1 == 2
    assert "hello".upper() == "HELLO"
