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

from backend.privacy_shield import PrivacyShield
import numpy as np
import onnxruntime as ort
import logging
import os
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import our specialized Engines
from backend.tbo_client import TBOClient
from backend.inventory_defense import acquire_inventory_lock, InventoryFullException, release_inventory_lock
from backend.fintech.payment_engine import PaymentProcessor
from backend.growth import ViralLoopEngine
from backend.privacy_shield import PrivacyShield

# Initialize Engines
app = FastAPI(title="Project Ancile API", version="1.0.0")
logger = logging.getLogger("uvicorn")

# Engines
tbo_engine = TBOClient()
payment_engine = PaymentProcessor()
growth_engine = ViralLoopEngine()
privacy_engine = PrivacyShield()

# ML Runtime (ONNX)
# We load this lazily or on startup

ML_MODEL_PATH = os.path.join(os.path.dirname(__file__), "apt1_v1.onnx")
try:
    if os.path.exists(ML_MODEL_PATH):
        ort_session = ort.InferenceSession(ML_MODEL_PATH)
        logger.info("APT-1 AI Model Loaded Successfully.")
    else:
        logger.warning("APT-1 Model not found. AI features will be disabled.")
        ort_session = None
except Exception as e:
    logger.error("Failed to load AI Model: %s", e)
    ort_session = None

# CORS for Microsite Access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to *.ancile.app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---


class GroupConfig(BaseModel):
    name: str
    subdomain: str
    event_date: str


class InventoryRequest(BaseModel):
    group_id: str
    room_type: str


class BookingRequest(BaseModel):
    group_id: str
    room_type: str
    guest_email: str
    guest_name: str
    origin_city: str  # For AI
    booking_lead_time: int
    room_price: float
    avg_income_proxy: float = 50000.0  # Placeholder logic for demo
    agent_id: str


class BookingResponse(BaseModel):
    lock_token: str
    checkout_url: str
    risk_score: float

# --- Endpoints ---


@app.get("/")
def health_check():
    return {"status": "active", "version": "1.0.0", "ai_status": "online" if ort_session else "offline"}


@app.get("/groups/{subdomain}")
def get_group_microsite_config(subdomain: str):
    """
    Powers the Microsite: Returns the branding, event details, and AVAILABLE inventory blocks.
    Real-time TBO check + Database check would happen here.
    """
    # Mock Response for Prototype
    # In real world: Query DB for group_id by subdomain
    logger.info("Fetching config for subdomain: %s", subdomain)
    return {
        "group_id": "grp_12345",
        "name": "Smith-Jones Wedding",
        "hero_image": "https://example.com/wedding.jpg",
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
    if ort_session:
        # Preprocessing inputs to match ONNX Model shape
        # float32 matches 'FloatTensorType'
        # inputs variable removed as it was unused in mocked inference block
        try:
            # Run inference
            # Output is usually [label, probabilities] for classifiers
            # Detailed implementation depends on how skl2onnx exported it
            # For now, we simulate a mock score if inference complexity is high
            risk_score = 0.15
        except Exception as e:
            logger.error("AI Inference failed: %s", e)
            risk_score = 0.5  # Default to medium risk

    # Policy: If Risk > 0.8, maybe reject or require higher deposit?
    # For now, we just log it.
    logger.info("Guest Risk Score: %s", risk_score)

    # 2. INVENTORY DEFENSE
    try:
        lock_token = acquire_inventory_lock(
            request.group_id, request.room_type)
    except InventoryFullException:
        raise HTTPException(
            status_code=409, detail="Sold Out! Someone grabbed the last room seconds ago.")

    # 3. FINTECH (Stripe)
    try:
        # Calculate Splits
        # Example: Price $250. Net $180. Markup $50. Fee $20.
        # We assume request.room_price covers everything.
        markup_cents = 5000  # $50.00
        total_cents = int(request.room_price * 100)

        # In a real app, agent_connect_id comes from the 'agents' table via request.agent_id
        dummy_agent_stripe_id = "acct_123456789"

        session = payment_engine.create_checkout_session(
            guest_email=request.guest_email,
            room_name=request.room_type,
            total_amount_cents=total_cents,
            agent_connect_id=dummy_agent_stripe_id,
            markup_cents=markup_cents
        )
    except Exception as e:
        # Rollback Lock if Payment fails setup
        release_inventory_lock(request.group_id, request.room_type, lock_token)
        logger.error(f"Payment Init Failed: {e}")
        raise HTTPException(status_code=500, detail="Payment Gateway Error")

    return {
        "lock_token": lock_token,
        "checkout_url": session["checkout_url"],
        "risk_score": float(risk_score)
    }


@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
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
        raise HTTPException(status_code=400, detail=str(e))

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
