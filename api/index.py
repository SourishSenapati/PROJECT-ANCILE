"""
Vercel Serverless Function Entry Point
--------------------------------------
Adapts the FastAPI application to run within Vercel's serverless environment.
Includes a diagnostic fallback if the main application fails to load.
"""

import os
import sys
import traceback
from fastapi import FastAPI

# Ensure the project root is in sys.path so we can import 'backend'
ROOT_PATH = os.path.dirname(os.path.dirname(__file__))
if ROOT_PATH not in sys.path:
    sys.path.append(ROOT_PATH)


def create_app() -> FastAPI:
    """Attempt to import the main app, or return a diagnostic app if it fails."""
    try:
        # pylint: disable=import-error, import-outside-toplevel
        from backend.main import app as backend_app
        return backend_app
    except Exception as err:  # pylint: disable=broad-except
        error_msg = str(err)
        error_trace = traceback.format_exc()

        diagnostic_app = FastAPI()

        @diagnostic_app.get("/api/health")
        def health_check():
            """Returns error details if the main app fails to load."""
            return {"status": "error", "error": error_msg, "trace": error_trace}

        @diagnostic_app.get("/api/debug")
        def debug():
            """Returns detailed environment stats for troubleshooting."""
            return {
                "status": "error",
                "error": error_msg,
                "trace": error_trace,
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "root_path": ROOT_PATH
            }

        return diagnostic_app


app = create_app()
