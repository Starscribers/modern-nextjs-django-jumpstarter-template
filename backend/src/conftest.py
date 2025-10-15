"""
Pytest configuration for Django tests.
"""

import pytest


@pytest.fixture(scope="function")
def api_client():
    """Create an API client for testing."""
    from rest_framework.test import APIClient

    return APIClient()


@pytest.fixture(scope="function")
def user_factory():
    """Create a user factory for testing."""
    from django.contrib.auth import get_user_model

    User = get_user_model()

    def create_user(**kwargs):
        defaults = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        defaults.update(kwargs)
        return User.objects.create_user(**defaults)

    return create_user


@pytest.fixture(scope="function")
def authenticated_user(user_factory):
    """Create an authenticated user."""
    return user_factory()


@pytest.fixture(scope="function")
def api_client_authenticated(api_client, authenticated_user):
    """Create an authenticated API client."""
    api_client.force_authenticate(user=authenticated_user)
    return api_client
