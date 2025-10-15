#!/bin/sh
fifo_suffix=""

case ${SQS_ENDPOINT_URL} in
  *.fifo)
    fifo_suffix=".fifo"
    ;;
esac

echo "SQS_ENDPOINT_URL = ${SQS_ENDPOINT_URL}; fifo_suffix = $fifo_suffix"


uv run python -m celery -A example_project worker -l info -Q celery$fifo_suffix --pool=threads -c 5 --detach -f celery.log -O fair --hostname=celery_worker@%h
tail -F celery.log
