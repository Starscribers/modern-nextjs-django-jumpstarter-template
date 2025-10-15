#!/bin/sh
uv run python manage.py migrate --noinput
uv run python manage.py syncfixtures
uv run python manage.py runserver 0.0.0.0:${PORT:-8000} --noreload
# uv run gunicorn -w 4 -b 0.0.0.0:${PORT:-8000} example_project.wsgi:application
exec "$@"
