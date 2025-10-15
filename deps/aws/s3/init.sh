#!/usr/bin/env bash
PROJECT_BASE_NAME=cdp-v3
awslocal s3 mb s3://filestore
awslocal s3 mb s3://datahub
awslocal s3 mb s3://image
