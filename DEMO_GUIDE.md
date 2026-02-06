# Project Ancile: Demo & Presentation Guide

##  Quick Start (Localhost)

1. **Start the Server**:
   Run the following command in your terminal:

   ```powershell
   py -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
   ```

2. **Open the Web App**:
   Navigate to [http://localhost:8000/](http://localhost:8000/) in your browser.

---

##  Verified Features

All core features are active and running locally.

### 1.  TBO Connect (Hotel Search)

- **Feature**: Live hotel search integration.
- **Demo Action**: Go to `/api/hotels/search?city=Bali`.
- **Status**: **Active (Simulated)**.
  - _Note_: Since we are running locally without live TBO credentials, the system automatically falls back to a high-fidelity simulation, returning realistic hotel data for demonstration.

### 2.  Inventory Defense (Atomic Locks)

- **Feature**: Prevents double-booking using Redis locking.
- **Status**: **Active (Mocked)**.
  - _Note_: The system automatically detects if a local Redis server is missing and switches to an **In-Memory Mock**. This ensures the booking flow works perfectly for demos without complex setup.

### 3.  Viral Growth Loop

- **Feature**: Generates agent tracking links.
- **Demo Action**: System can generate referral footers dynamically via the API.

### 4.  Fintech Integration

- **Feature**: Stripe payment session creation.
- **Status**: **Active**.
  - _Note_: The payment engine is wired to mock endpoints for the demo, allowing you to proceed through the checkout flow without real credit card charges.

---

##  Troubleshooting

- **Browser Error**: If the page doesn't load, ensure the python server command is still running.
- **Linting**: All code quality checks have been passed (Zero-Flaw Standard).
