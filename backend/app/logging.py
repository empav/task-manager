import logging
import json_log_formatter


def setup() -> None:
    formatter = json_log_formatter.JSONFormatter()
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger()
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


setup()
