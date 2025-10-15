from datetime import datetime, time

from crontab import CronSlices
from django.core.exceptions import ValidationError
from django.utils import timezone
from django_celery_beat.models import CrontabSchedule

cron_pattern = r"^\S+ \S+ \S+ \S+ \S+$"


def validate_cron_expression(cron_expression: str) -> None:
    """
    Validate a cron expression.
    :param cron_expression: The cron expression to validate.
    :raises ValidationError: If the cron expression is invalid.
    """
    if not CronSlices.is_valid(cron_expression):
        message = f"Invalid cron expression {cron_expression}"
        raise ValidationError(message)


def create_cron_expression(
    minute: int | str = "*",
    hour: int | str = "*",
    day: int | str = "*",
    month: int | str = "*",
    weekdays: list[int] | str = "*",
    day_interval: int = 1,
) -> str:
    """
    Create a cron string based on the provided parameters.
    """

    if isinstance(weekdays, list):
        weekdays = "*" if len(weekdays) == 0 else ",".join(str(w) for w in weekdays)

    if day_interval > 1:
        day = f"{day}/{day_interval}"

    return f"{minute} {hour} {day} {month} {weekdays}"


def validate_weekdays(weekdays: list[int]) -> bool:
    """
    Validate a list of weekdays for a cron expression (0-7, no duplicates).

    Args:
        weekdays (list): List of weekdays to validate.

    Returns:
        bool: True if the list is valid, False otherwise.
    """
    valid_weekdays = set(range(8))
    weekdays_set = set(weekdays)

    # Check if all values are valid weekdays (0-7) and there are no duplicates
    return (
        weekdays_set.issubset(valid_weekdays)
        and len(weekdays_set) == len(weekdays)
        and not {0, 7}.issubset(weekdays_set)
    )


def get_cron_expression_from_crontab(crontab: CrontabSchedule) -> str:
    """
    Get the cron expression from a CrontabSchedule instance.
    """
    return f"{crontab.minute} {crontab.hour} {crontab.day_of_month} {crontab.month_of_year} {crontab.day_of_week}"


def dissect_cron_expression(cron_expression: str) -> dict[str, str]:
    """
    Dissect a cron expression into its components.
    :param cron_expression: The cron expression to dissect.
    :return: A dictionary with the components of the cron expression.
    """
    parts = cron_expression.split()
    length = 5
    if len(parts) != length:
        message = f"Cron expression must have {length} parts, got {len(parts)}"
        raise ValidationError(message)

    return {
        "minute": parts[0],
        "hour": parts[1],
        "day_of_month": parts[2],
        "month_of_year": parts[3],
        "day_of_week": parts[4],
    }


def convert_datetime_to_cron_expression(
    date_time: str | datetime,
) -> str:
    """
    Convert a datetime string to a cron expression.
    :param date_time: The datetime string to convert.
    :return: A cron expression or None if date_time is None.
    """

    date_time = (
        date_time
        if isinstance(date_time, datetime)
        else datetime.fromisoformat(date_time)
    )
    dt = date_time.astimezone(timezone.get_current_timezone())
    return create_cron_expression(
        minute=dt.minute,
        hour=dt.hour,
        day=dt.day,
        month=dt.month,
        weekdays="*",
    )


def get_intervals(cron_expression: str) -> tuple[int, int, str]:
    """
    !!! cron_expression intervals are defined differently from the usual cron syntax.
    intervals are expected to spam over months, but not reset at the start of a month like usual cron.

    get the interval of days and weeks from a cron expression.
    :param cron_expression: The cron expression to check.
        - e.g. '0 0 * * *' represents every day.
        - e.g. '0 0 */5 * *' represents every 5 days on Monday.
        - e.g. '0 0 * * 1/2' represents every 2 weeks on Monday.
        - e.g. '0 0 * * 1' represents every week on Monday.
    :return: A tuple containing the day interval and week interval and the time of day.
    """
    dissected = dissect_cron_expression(cron_expression)
    week_interval = (
        int(dissected["day_of_week"].split("/")[1])
        if "/" in dissected["day_of_week"]
        else 1
    )
    day_interval = (
        int(dissected["day_of_month"].split("/")[1])
        if "/" in dissected["day_of_month"]
        else 1
    )
    time_of_day = time(
        hour=int(dissected["hour"]),
        minute=int(dissected["minute"]),
    ).isoformat()
    return day_interval, week_interval, time_of_day
