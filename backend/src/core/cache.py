from __future__ import annotations

from functools import wraps
from typing import TYPE_CHECKING

from django.core.cache import cache

if TYPE_CHECKING:
    from collections.abc import Callable


def cacheable(cache_key: str | Callable, timeout: int = 600) -> Callable:
    """A decorator to cache function return value, preventing unnecessary calls to the function.
    Args:
        cache_key: The key to use for the cache, can pass in a function to generate the key,
            the function should have the same signature as the decorated function
            ```
            @cacheable(lambda x: f'foo_{x}')
            def foo(x):
                return x
            ```
            but this may cause memory leak, so make sure:
            1. cached values are small enough
            2. you set a shorter `timeout`
        timeout: `TTL` for a cache key, in seconds. Default to 600 seconds (10 minutes)
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args: tuple, refresh_cache: bool = False, **kwargs: dict) -> None:
            if callable(cache_key):
                # pass self if the function is a bound method
                cache_key_ = cache_key(*args, **kwargs)
            else:
                cache_key_ = cache_key

            value = cache.get(cache_key_)
            if value and not refresh_cache:
                return value

            value = func(*args, **kwargs)

            cache.set(cache_key_, value, timeout)

            return value

        return wrapper

    return decorator
