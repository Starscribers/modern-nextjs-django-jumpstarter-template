from __future__ import annotations

from any_registries import Registry

from .models import FixtureRevision

seeder_registry = Registry[str, type[FixtureRevision]]().auto_load("*/fixtures.py")
