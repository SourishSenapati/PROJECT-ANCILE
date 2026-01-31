"""
ANCILE API GATEWAY
------------------
The central nervous system of the Group Inventory Management Platform.
Ties together:
1. Inventory Defense (Redis Locking)
2. TBO Connect (Hotel API)
3. APT-1 (AI Prediction)
4. Fintech (Stripe Split Payments)
5. Viral Growth (Referrals)
"""

import logging
import os
import joblib
import pandas as pd
import onnxruntime as ort
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import sys

from backend.fintech.payment_engine import PaymentProcessor
from backend.growth import ViralLoopEngine
from backend.inventory_defense import (
    InventoryFullException,
    acquire_inventory_lock,
    release_inventory_lock,
)
from backend.privacy_shield import PrivacyShield
from backend.tbo_client import TBOClient

# Initialize App
app = FastAPI(title="Project Ancile Backend", version="1.0.0")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ancile_backend")

# Engines
payment_engine = PaymentProcessor()
# growth_engine = ViralLoopEngine() # Feature flag disabled for Phase 1
# privacy_engine = PrivacyShield() # Initialized later if needed
# tbo_engine = TBOClient() # Feature flag disabled

# ML Runtime (Hybrid: ONNX Preferred, Pickle Fallback)
ML_FOLDER = os.path.dirname(__file__)
ONNX_PATH = os.path.join(ML_FOLDER, "apt1_v1.onnx")
PICKLE_PATH = os.path.join(ML_FOLDER, "apt1_v1.pkl")

ort_session = None
sklearn_pipeline = None

# 1. Try ONNX
try:
    if os.path.exists(ONNX_PATH):
        ort_session = ort.InferenceSession(ONNX_PATH)
        logger.info("APT-1 AI: ONNX Model Loaded.")
    else:
        logger.warning("APT-1 AI: ONNX Model not found.")
except Exception as e:  # pylint: disable=broad-except
    logger.error("APT-1 AI: ONNX Load Failed: %s", e)

# 2. Try Pickle (Fallback)
if not ort_session:
    try:
        if os.path.exists(PICKLE_PATH):
            sklearn_pipeline = joblib.load(PICKLE_PATH)
            logger.info("APT-1 AI: Sklearn Pickle Model Loaded (Fallback).")
        else:
            logger.warning(
                "APT-1 AI: No model found (checked .onnx and .pkl).")
    except Exception as e:  # pylint: disable=broad-except
        logger.error("APT-1 AI: Pickle Load Failed: %s", e)


# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://project-ancile.vercel.app",
    "https://project-ancile.onrender.com",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---


class GroupConfig(BaseModel):
    """Configuration for a specific wedding group microsite."""
    name: str
    subdomain: str
    event_date: str


class InventoryRequest(BaseModel):
    """Request model for checking inventory availability."""
    group_id: str
    room_type: str


class BookingRequest(BaseModel):
    """
    Request model for initiating a booking.
    Includes guest details and data points for AI risk scoring.
    """
    group_id: str
    room_type: str
    guest_email: str
    guest_name: str
    origin_city: str  # For AI
    booking_lead_time: int
    room_price: float
    avg_income_proxy: float = 50000.0  # Placeholder logic for demo
    relation_to_host: str = "Friend"  # Added feature
    agent_id: str


class BookingResponse(BaseModel):
    """Response model for a successful booking, including checkout URL."""
    lock_token: str
    checkout_url: str
    risk_score: float


# --- Endpoints ---


@app.get("/")
def health_check():
    """Simple health check endpoint to verify API status."""
    ai_status = "offline"
    if ort_session:
        ai_status = "onnx"
    elif sklearn_pipeline:
        ai_status = "pickle"

    return {"status": "active", "version": "1.0.0", "ai_status": ai_status}
    """
    Health check endpoint.
    Returns the status of the API and the loaded AI engine.
    """
    return {
        "status": "active",
        "version": "1.0.0",
        "ai_status": "onnx" if ort_session else "pickle"
    }


@app.get("/")
def read_root():
    """
    Serves the main frontend Single Page Application (SPA).
    """
    return FileResponse('frontend/index.html')


# Mount frontend static files (CSS, JS)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# --- Endpoints ---


@app.get("/groups/{group_id}")
def get_group_config(group_id: str):
    """
    Retrieves the configuration for a specific group microsite.
    In a real app, this would fetch from a database.
    """
    # Mock Data
    return {
        "group_id": group_id,
        "microsite_url": f"https://{group_id}.ancile.app",
        "theme": "dark_modern",
        "inventory": [
            {
                "room_type": "DELUXE_OCEAN",
                "price": 250.00,
                "remaining": 12  # This would be calculated via Redis+DB
            },
            {
                "room_type": "STANDARD_GARDEN",
                "price": 180.00,
                "remaining": 5
            }
        ]
    }


@app.post("/bookings/initiate", response_model=BookingResponse)
def initiate_booking(request: BookingRequest):
    """
    The Core Transaction Flow:
    1. AI Risk Check (APT-1) - Should we accept this guest?
    2. Inventory Lock (Redis) - Prevent double booking.
    3. Payment Setup (Stripe) - Capture the float.
    """

    # 1. AI PREDICTION (APT-1)
    risk_score = 0.0

    # Prepare Features
# Features expected:
    # ['guest_distance_km', 'booking_lead_time', 'room_price_vs_avg_income', 'relation_to_host']
    # We mock distance for now as we don't have a geocoder active
    mock_distance = 500.0
    price_ratio = request.room_price / (
        request.avg_income_proxy if request.avg_income_proxy > 0 else 1.0
    )

    input_data = pd.DataFrame([{
        'guest_distance_km': mock_distance,
        'booking_lead_time': float(request.booking_lead_time),
        'room_price_vs_avg_income': float(price_ratio),
        'relation_to_host': request.relation_to_host
    }])

    try:
        if ort_session:
            # ONNX Inference (Placeholder implementation - requires strict types)
            pass

        if sklearn_pipeline:
            # Sklearn Inference
            probs = sklearn_pipeline.predict_proba(input_data)
            risk_score = float(probs[0][1])  # Probability of Class 1
            logger.info("AI Probability: %.4f", risk_score)

    except ValueError as e:
        logger.error("AI Feature Error: %s", e)
        risk_score = 0.5
    except Exception as e:  # pylint: disable=broad-except
        logger.error("AI Inference failed: %s", e)
        risk_score = 0.5  # Default to medium risk

    # Policy: If Risk > 0.8, maybe reject or require higher deposit?
    logger.info("Guest Risk Score: %s", risk_score)

    # 2. INVENTORY DEFENSE
    try:
        lock_token = acquire_inventory_lock(
            request.group_id, request.room_type)
    except InventoryFullException as exc:
        raise HTTPException(
            status_code=409, detail="Sold Out! Someone grabbed the last room seconds ago.") from exc

    # 3. FINTECH (Stripe)
    try:
        # Calculate Splits
        # Example: Price $250. Net $180. Markup $50. Fee $20.
        markup_cents = 5000  # $50.00
        total_cents = int(request.room_price * 100)
        dummy_agent_stripe_id = "acct_123456789"

        session = payment_engine.create_checkout_session(
            guest_email=request.guest_email,
            room_name=request.room_type,
            total_amount_cents=total_cents,
            agent_connect_id=dummy_agent_stripe_id,
            markup_cents=markup_cents
        )
    except Exception as e:
        # Rollback Lock
        release_inventory_lock(request.group_id, request.room_type, lock_token)
        logger.error("Payment Init Failed: %s", e)
        raise HTTPException(
            status_code=500, detail="Payment Gateway Error") from e

    return {
        "lock_token": lock_token,
        "checkout_url": session["checkout_url"],
        "risk_score": float(risk_score)
    }


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """
    Handles incoming Stripe webhooks (e.g., checkout.session.completed).
    """
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    # In production, use real secret
    webhook_secret = "whsec_test_secret"

    try:
        success = payment_engine.handle_webhook(
            payload, sig_header, webhook_secret)
        if success:
            return {"status": "processed"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    return {"status": "ignored"}

# --- Phase 7 & 8 Extensions ---

privacy_engine = PrivacyShield()


@app.post("/analyze/vip-shield")
def analyze_guest_list(raw_text: str):
    """
    Phase 7: Local Edge Processing of Guest Lists.
    Input: Raw copy-paste of a guest list (names, diets, roles).
    Output: Sanitized JSON with names removed + Aggregate Stats.
    """
    if not privacy_engine.is_active:
        raise HTTPException(
            status_code=503,
            detail="Privacy Shield (Ollama) is offline on this Edge Node."
        )

    result = privacy_engine.sanitize_guest_list(raw_text)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])

    return result


@app.get("/analytics/heatmap")
def get_demand_heatmap():
    """
    Phase 8: Strategic Dashboard Data.
    Returns simulated 'Supply Gap' data for the Mapbox visualization.
    """
    # Mocking the SQL View result created in analytics_schema.sql
    return {
        "regions": [
            {
                "city": "Bali",
                "country": "Indonesia",
                "month": "2026-06",
                "demand_score": 850,  # High guest interest
                "supply_rooms": 120,  # Low TBO inventory
                "alert": "CRITICAL: Shortage of 730 rooms. Acquire inventory now."
            },
            {
                "city": "Dubai",
                "country": "UAE",
                "month": "2026-05",
                "demand_score": 400,
                "supply_rooms": 1500,
                "alert": "Stable: Surplus inventory."
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    # Use 0.0.0.0 to expose to local network if needed, but localhost is fine for now
    uvicorn.run(app, host="0.0.0.0", port=8000)
