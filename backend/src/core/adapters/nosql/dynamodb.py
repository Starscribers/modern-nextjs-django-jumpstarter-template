from __future__ import annotations

import time
from typing import Self

import boto3

from core.config import settings
from core.utils import (
    logger,
)


def get_ddb_response_with_paginate(client: boto3.client, query_dict: dict) -> dict:
    while True:
        response = client.query(**query_dict)

        yield response

        if "LastEvaluatedKey" not in response:
            break

        query_dict["ExclusiveStartKey"] = response["LastEvaluatedKey"]


class DDBClient:
    def get_table(self: Self) -> boto3.resource:
        retry_count = 0
        retry_delay = 5
        max_retry = 10
        while True:
            try:
                dynamodb = boto3.resource(
                    "dynamodb",
                    endpoint_url=settings.DYNAMODB_ENDPOINT_URL,
                )
                return dynamodb.Table(self.database_name)
            except KeyError as e:
                retry_count += 1
                if retry_count > max_retry:
                    msg = "Fail to get dynamodb resource"
                    raise ConnectionError(msg) from e
                logger.warn(
                    f"Fail when get dynamodb resource, retrying in {retry_delay}s ...{retry_count} / {max_retry}",
                )
                time.sleep(retry_delay)
