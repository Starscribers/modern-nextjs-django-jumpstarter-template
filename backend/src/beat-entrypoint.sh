#!/bin/sh
uv run python -m celery -A example_project beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
exec "$@"
