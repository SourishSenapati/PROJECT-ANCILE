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

# Declare app at top level for Vercel detection
app = FastAPI()

try:
    from backend.main import app as backend_app
    app = backend_app
except Exception as e:
    ERROR_MSG = str(e)
    ERROR_TRACE = traceback.format_exc()

    @app.get("/api/health")
    def health_check():
        """Returns error details if the main app fails to load."""
        return {"status": "error", "error": ERROR_MSG, "trace": ERROR_TRACE}

    @app.get("/api/debug")
    def debug():
        """Returns detailed environment stats for troubleshooting."""
        return {
            "status": "error",
            "error": ERROR_MSG,
            "trace": ERROR_TRACE,
            "sys_path": sys.path,
            "cwd": os.getcwd()
        }
