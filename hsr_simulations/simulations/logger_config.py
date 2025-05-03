import logging


def get_default_logger() -> logging.Logger:
    logger = logging.getLogger("hsr_eidolon_value_analysis")
    logger.setLevel(logging.INFO)
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(asctime)s - %(levelname)s - %(module)s:%(lineno)d -  %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger
