# PROJECT ANCILE: Group Commerce Engine

**Status**: Phase 6 Complete (Ready for First Mover Execution)

## Executive Vision

Project Ancile is a digital-first Group Inventory Management Platform paired with customized microsites. It digitizes the complex, offline-heavy MICE and Wedding coordination process by:

1. **Centralizing Inventory**: Creating a "Source of Truth" that locks inventory to specific groups.
2. **Microsite-Driven Booking**: Empowering guests to book directly via a branded portal.
3. **Atomic Inventory Defense**: Using Redis-based pessimistic locking to strictly prevent double-booking.
4. **AI-Powered Yield**: Using "APT-1" to predict cancellation risks and optimize inventory float.
5. **Fintech-Native**: Managing split payments (Net, Markup, Fee) automatically via Stripe Connect.

## Architecture

### 1. The Core Engines (Backend)

Located in `/backend`, built with **FastAPI**.

- **Inventory Defense (`inventory_defense.py`)**: Uses Redis `SETNX` to hold rooms for 10 minutes while payment processes.
- **APT-1 AI Model (`ml_engine/`)**: XGBoost/ONNX model trained on synthetic wedding data to predict cancellation risk.
- **TBO Connectivity (`tbo_client.py`)**: Smart wrapper for the TBO Hotel API with token caching. Configured for **TBO Staging Environment**.
- **Fintech (`fintech/`)**: Stripe Connect logic for "Split Payments" (holding the float vs. paying the agent).
- **Growth (`growth.py`)**: "Viral Loop" system injecting referral links into vouchers.

### 2. Infrastructure

- **Database**: PostgreSQL for persistent records (Groups, Guests, Ledger).
- **Cache**: Redis Cluster for high-frequency inventory locking.
- **Hardware**: Project leverages **NVIDIA RTX 4050 (6GB VRAM)** for future Deep Learning models, ensuring scalability.
- **Deployment**: Dockerized (`Dockerfile` + `docker-compose.yml`) for scalable AWS/DigitalOcean deployment.

## Getting Started

### Prerequisites

- Python 3.9+
- Redis
- PostgreSQL
- Stripe API Keys

### Running Locally

```bash
# 1. Install Dependencies
pip install -r backend/requirements.txt
pip install -r ml_engine/requirements.txt

# 2. Train AI Model (One-off)
python ml_engine/generate_data.py
python ml_engine/train_apt1.py

# 3. Start Infrastructure (Docker)
docker-compose up -d redis-lock db

# 4. Run API
cd backend
uvicorn main:app --reload
```

## API Endpoints (Key)

- `GET /groups/{subdomain}` -> Powers the Microsite.
- `POST /bookings/initiate` -> The "Atomic" transaction (AI Check -> Redis Lock -> Stripe Payment).
- `POST /webhook/stripe` -> Commits the booking upon payment success.
