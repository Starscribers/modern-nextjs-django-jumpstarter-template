import gc
from collections.abc import Callable
from copy import deepcopy
from functools import wraps


def pre_and_post_run_gc(func: Callable) -> Callable:
    @wraps(func)
    def wrap(*args: tuple, **kwargs: dict) -> None:
        gc.collect()
        return_value = func(*args, **kwargs)
        gc.collect()

        return return_value

    return wrap


def return_copy(func: Callable) -> Callable:
    """A decorator to return the copy of function return value."""

    @wraps(func)
    def wrapper(*args: tuple, **kwargs: dict) -> None:
        return deepcopy(func(*args, **kwargs))

    return wrapper
