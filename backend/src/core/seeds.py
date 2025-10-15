from __future__ import annotations

from django_celery_beat.models import CrontabSchedule, PeriodicTask
from seeds import Seeder, seeder_registry


@seeder_registry.register("tasks")
class TasksSeeder(Seeder):
    fixture_path = "core/fixtures/tasks.json"
    exporting_querysets = (
        CrontabSchedule.objects.all(),
        PeriodicTask.objects.exclude(name__startswith="heartbeat_"),
    )
