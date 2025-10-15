FROM python:3.12-slim

RUN mkdir /code && \
    apt update && \
    apt install -y --no-install-recommends unzip vim zip curl && \
    apt clean && \
    pip install --upgrade pip && \
    pip install uv && \
    adduser example_project

USER example_project

ENV PYTHONUNBUFFERED=1
WORKDIR /home/example_project/

COPY --chown=example_project:example_project ./src/ .
RUN uv sync

RUN uv run python manage.py collectstatic --noinput
ENV PORT=${PORT:-8000}
EXPOSE ${PORT}
CMD ["sh", "./backend-entrypoint.sh"]
