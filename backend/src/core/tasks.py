from collections.abc import Callable
from datetime import timedelta
from typing import Any

from celery.canvas import Signature, signature
from django.apps import apps
from django.utils import timezone

from example_project.celery import app

from .models import CeleryTask, UsageControlModel


@app.task
def periodic_cleanup_celery_tasks() -> None:
    delete_to = timezone.localtime() - timedelta(days=7)
    CeleryTask.objects.filter(created_at__lte=delete_to).delete()


@app.task
def append_usage(
    app_label: str,
    model_name: str,
    instance_uuid: str,
    owner_type: str,
    owner_key: str,
) -> None:
    """
    Append usage to the task.
    """
    model = apps.get_model(app_label, model_name)
    if not issubclass(model, UsageControlModel):
        message = f"Invalid model: {model}"
        raise TypeError(message)

    with model.lock_instance(uuid=instance_uuid) as locked_instance:
        locked_instance.usage_info.setdefault(owner_type, [])
        locked_instance.usage_info[owner_type].append(owner_key)

        if locked_instance.status != "in_use":
            locked_instance.status = "in_use"

        locked_instance.save(update_fields=["status", "usage_info"])


@app.task
def remove_usage(
    app_label: str,
    model_name: str,
    instance_uuid: str,
    owner_type: str,
    owner_key: str,
) -> None:
    """
    Append usage to the task.
    """
    model = apps.get_model(app_label, model_name)
    if not issubclass(model, UsageControlModel):
        message = f"Invalid model: {model}"
        raise TypeError(message)

    with model.lock_instance(uuid=instance_uuid) as locked_instance:
        if owner_key in locked_instance.usage_info[owner_type]:
            locked_instance.usage_info[owner_type].remove(owner_key)

        if not locked_instance.usage_info[owner_type]:
            locked_instance.usage_info.pop(owner_type)

        if not locked_instance.usage_info:
            locked_instance.status = "available"

        locked_instance.save(update_fields=["status", "usage_info"])


def wrap_instance_method_into_signature(
    method: Callable,
    *args: Any,
    **kwargs: Any,
) -> Signature:
    instance = method.__self__
    method_name = method.__name__

    pk = instance.pk
    if type(instance.pk) not in (int, str):
        pk = str(instance.pk)
    return signature(
        call_instance_method,
        args=(instance.get_app(), instance.get_model_name(), method_name, pk, *args),
        kwargs=kwargs,
    )


@app.task
def call_instance_method(
    app_label: str,
    model_name: str,
    method_name: str,
    instance_pk: int | str,
    *args: Any,
    **kwargs: Any,
) -> Any:
    model = apps.get_model(app_label, model_name)
    instance = model.objects.get(pk=instance_pk)
    method = getattr(instance, method_name)
    return method(*args, **kwargs)
