
import logging
import json
from datetime import datetime
from logging.handlers import RotatingFileHandler
import traceback

# Configure the logger
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    handlers=[
        RotatingFileHandler("app.log", maxBytes=10_000_000, backupCount=5),
    ]
)
logger = logging.getLogger(__name__)

def log_error(message, error=None, **kwargs):
    error_type = type(error).__name__ if error else "No Exception"
    error_message = str(error) if error else message

    error_info = {
        "timestamp": datetime.now().isoformat(),
        "level": "ERROR",
        "message": message,
        "error_type": error_type,
        "error_message": error_message,
        "stack_trace": traceback.format_exc(),
        **kwargs
    }
    logger.error(json.dumps(error_info))
