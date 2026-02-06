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
import uuid
import re
import joblib
from fastapi import APIRouter, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel

from backend.fintech.payment_engine import PaymentProcessor
from backend.inventory_defense import (
    InventoryFullException,
    acquire_inventory_lock,
    release_inventory_lock,
)
from backend.growth import ViralLoopEngine
from backend.tbo_client import TBOClient

# Initialize App
app = FastAPI(title="Project Ancile Backend", version="1.0.0")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every incoming request for debugging Vercel routing."""
    method = request.method
    url = str(request.url)
    print(f"Incoming: {method} {url}")
    try:
        response = await call_next(request)
        print(f"Outgoing: {response.status_code} for {url}")
        return response
    except Exception as e:  # pylint: disable=broad-except
        print(f"Error processing {url}: {str(e)}")
        raise e

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ancile_backend")

# Engines
payment_engine = PaymentProcessor()
growth_engine = ViralLoopEngine()
tbo_client = TBOClient()

# ML Runtime (Scikit-Learn Pickle)
ML_FOLDER = os.path.dirname(__file__)
PICKLE_PATH = os.path.join(ML_FOLDER, "apt1_v1.pkl")
sklearn_pipeline = None

try:
    if os.path.exists(PICKLE_PATH):
        sklearn_pipeline = joblib.load(PICKLE_PATH)
        logger.info("APT-1 AI: Sklearn Pickle Model Loaded.")
    else:
        logger.warning("APT-1 AI: No model found at %s", PICKLE_PATH)
except Exception as e:  # pylint: disable=broad-except
    logger.error("APT-1 AI: Pickle Load Failed: %s", e)

# CORS Configuration
origins = ["*"]
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
    """Request model for initiating a booking."""
    group_id: str
    room_type: str
    guest_email: str
    guest_name: str
    origin_city: str
    booking_lead_time: int
    room_price: float
    avg_income_proxy: float = 50000.0
    relation_to_host: str = "Friend"
    agent_id: str


class BookingResponse(BaseModel):
    """Response model for a successful booking initiation."""
    lock_token: str
    checkout_url: str
    risk_score: float


class IdentityVerificationRequest(BaseModel):
    """Request model for guest identity verification."""
    guest_name: str
    passport_number: str
    id_type: str = "Passport"


class IdentityVerificationResponse(BaseModel):
    """Response model for identity verification status."""
    verification_id: str
    status: str
    risk_assessment: str
    facial_match_probability: float


# --- Endpoints ---
router = APIRouter(prefix="/api")


@router.get("/health")
def health_check():
    """Returns the API health status and AI engine availability."""
    ai_status = "pickle" if sklearn_pipeline else "offline"
    return {"status": "active", "version": "1.0.0", "ai_status": ai_status}


@router.get("/groups/{group_id}")
def get_group_config(group_id: str):
    """Retrieves the configuration for a specific group microsite."""
    return {
        "group_id": group_id,
        "microsite_url": f"https://{group_id}.ancile.app",
        "theme": "dark_modern",
        "inventory": [
            {"room_type": "DELUXE_OCEAN", "price": 250.00, "remaining": 12},
            {"room_type": "STANDARD_GARDEN", "price": 180.00, "remaining": 5}
        ]
    }


@router.post("/bookings/initiate", response_model=BookingResponse)
def initiate_booking(request: BookingRequest):
    """The Core Transaction Flow: AI Risk Check, Inventory Lock, and Payment Setup."""
    risk_score = 0.5
    if sklearn_pipeline:
        try:
            mock_distance = 500.0
            price_ratio = request.room_price / \
                (request.avg_income_proxy if request.avg_income_proxy > 0 else 1.0)
            input_data = [[
                mock_distance,
                float(request.booking_lead_time),
                float(price_ratio),
                str(request.relation_to_host)
            ]]
            probs = sklearn_pipeline.predict_proba(input_data)
            risk_score = float(probs[0][1])
        except (ValueError, TypeError, KeyError) as e:
            logger.error("AI Feature processing failed: %s", e)
        except Exception as e:  # pylint: disable=broad-except
            logger.error("Unexpected AI Inference failure: %s", e)

    try:
        lock_token = acquire_inventory_lock(
            request.group_id, request.room_type)
    except InventoryFullException as exc:
        raise HTTPException(status_code=409, detail="Sold Out!") from exc

    # try:
    #     total_cents = int(request.room_price * 100)
    #     session = payment_engine.create_checkout_session(
    #         guest_email=request.guest_email,
    #         room_name=request.room_type,
    #         total_amount_cents=total_cents,
    #         agent_connect_id="acct_123456789",
    #         markup_cents=5000
    #     )
    # except Exception as e:
    #     release_inventory_lock(request.group_id, request.room_type, lock_token)
    #     raise HTTPException(
    #         status_code=500, detail="Payment Sync Error") from e

    # STRICT MOCK MODE for Payments
    session = {
        "checkout_url": "https://checkout.stripe.com/test-mock-url",
        "session_id": "sess_test_123"
    }

    return {
        "lock_token": lock_token,
        "checkout_url": session["checkout_url"],
        "risk_score": risk_score
    }


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handles incoming Stripe webhooks for payment processing."""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    try:
        success = payment_engine.handle_webhook(
            payload, sig_header, "whsec_test_secret")
        return {"status": "processed"} if success else {"status": "ignored"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/identity/verify", response_model=IdentityVerificationResponse)
async def verify_identity(request: IdentityVerificationRequest):
    """Simulates a high-security identity verification process."""
    verification_id = str(uuid.uuid4())
    status = "passed"
    risk = "Low"
    if "terror" in request.guest_name.lower():
        status, risk = "failed", "High"
    return {
        "verification_id": verification_id,
        "status": status,
        "risk_assessment": risk,
        "facial_match_probability": 0.98
    }


@router.get("/analytics/heatmap")
def get_demand_heatmap():
    """Returns simulated demand heatmap data for strategic visualizations."""
    return {"regions": [{"city": "Bali", "demand_score": 850, "status": "Critical"}]}


# --- New Advertised Feature Endpoints ---

@router.post("/auth/login")
def auth_login(request: Request):
    """
    Mock Authentication Endpoint.
    Resolves the console 405 error.
    """
    return {
        "token": "mock_jwt_token_12345",
        "user": {
            "id": "u_001",
            "name": "Operative 01",
            "clearance": "Top Secret"
        }
    }


@router.get("/hotels/search")
def search_hotels(city: str, nights: int = 1):
    """
    TBO CONNECT: Live Hotel Search (Advertised Feature #2).
    """
    logger.info("Searching hotels in %s for %d nights", city, nights)

    # STRICT MOCK MODE (Requested by User)
    # We are bypassing the live TBO client try/except block to ensure
    # zero external API calls are attempted during this phase.

    # try:
    #     # Note: In a real app we'd map city names to TBO CityCodes.
    #     # For this demo, we'll try a generic search or handle the specific TBO flow.
    #     # Since TBO Client needs specific auth, we wrap it safe.
    #     results = tbo_client.search_hotels(result_count=5)
    #     return {"status": "success", "provider": "TBO", "data": results}
    # except Exception as e:  # pylint: disable=broad-except
    #     logger.error("TBO Search Error: %s", e)

    # Fallback Mock Data so localhost 'works' visibly
    return {
        "status": "mock_fallback",
        "provider": "TBO (Simulated)",
        "data": {
            "HotelResult": [
                {"HotelName": "Grand Hyatt Bali",
                    "StarRating": 5, "Price": 250},
                {"HotelName": "Ubud Hanging Gardens",
                    "StarRating": 5, "Price": 450}
            ]
        },
        "error_detail": "Mock Mode Enforced"
    }


@router.post("/growth/referral-link")
def generate_referral_link(agent_id: str, agent_name: str):
    """
    VIRAL GROWTH: Generate Agent Referral Footer (Advertised Feature #5).
    """
    footer_html = growth_engine.generate_referral_footer(agent_id, agent_name)
    return {
        "status": "success",
        "html": footer_html,
        "preview_url": f"https://ancile.app/become-agent?ref={agent_id}"
    }


app.include_router(router)

# --- Frontend Serving ---
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST = os.path.join(ROOT_DIR, "frontend", "dist")


@app.get("/api/debug-frontend")
def debug_frontend():
    """Returns the structure of the frontend build directory for debugging."""
    if os.path.exists(FRONTEND_DIST):
        files = [os.path.join(r, f)
                 for r, _, fs in os.walk(FRONTEND_DIST) for f in fs]
        return {"dist_exists": True, "files": files, "cwd": os.getcwd()}
    return {"dist_exists": False, "cwd": os.getcwd()}


async def get_corrected_index():
    """Reads index.html and replaces stale asset links with actual files on disk."""
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if not os.path.exists(index_file):
        return None
    with open(index_file, "r", encoding="utf-8") as f:
        content = f.read()
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        js, css = "", ""
        for f in os.listdir(assets_dir):
            if f.startswith("index-") and f.endswith(".js"):
                js = f
            elif f.startswith("index-") and f.endswith(".css"):
                css = f
        if js:
            content = re.sub(
                r'src="/assets/index-[^"]+\.js"', f'src="/assets/{js}"', content)
        if css:
            content = re.sub(
                r'href="/assets/index-[^"]+\.css"', f'href="/assets/{css}"', content)
    return content


@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    """Serves the React frontend and handles client-side SPA routing."""
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404)
    clean_path = full_path.strip("/")
    if not clean_path:
        content = await get_corrected_index()
        if content:
            return HTMLResponse(content=content)
        return JSONResponse(status_code=404, content={"e": "No Index"})

    file_path = os.path.join(FRONTEND_DIST, clean_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)

    content = await get_corrected_index()
    if content:
        return HTMLResponse(content=content)
    return JSONResponse(status_code=404, content={"e": "No Build"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
