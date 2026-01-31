"""
Vercel Serverless Function Entry Point
--------------------------------------
Adapts the FastAPI application to run within Vercel's serverless environment.
"""

import sys
import os

# Ensure the project root is in sys.path so we can import 'backend'
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# pylint: disable=unused-import
# pylint: disable=postponed-import, wrong-import-position
from backend.main import app  # noqa: F401, E402
