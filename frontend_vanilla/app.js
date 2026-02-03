// MOCK_INVENTORY removed; we will use API data primarily or basic default if empty.
const API_BASE = ""; // Relative path for production (same origin)

// DOM Elements
const gridContainer = document.getElementById('room-grid');
const modal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');

// State
let currentPrice = 0;

/**
 * Fetches real inventory from the FastAPI Backend.
 */
async function fetchInventory() {
    try {
        // We use a demo subdomain trigger for now
        const res = await fetch(`${API_BASE}/groups/demo`);
        if (!res.ok) throw new Error("Backend Connection Failed");
        
        const data = await res.json();
        renderInventory(data.inventory);
    } catch (e) {
        console.error("API Error:", e);
        gridContainer.innerHTML = `<p style="text-align:center; color: #e74c3c;">Failed to load live inventory. Is the backend running?</p>`;
    }
}

/**
 * Renders the room cards into the grid.
 */
function renderInventory(inventory) {
    gridContainer.innerHTML = ''; // Clear loading state

    inventory.forEach(room => {
        const card = document.createElement('div');
        card.className = 'room-card glass-card';
        
        const name = room.name || room.room_type || "Standard Room";
        const price = room.price || 0;
        const stock = room.remaining !== undefined ? room.remaining : 5;
        
        // Images (Demo placeholder logic)
        let image = "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop";
        if (name.includes("OCEAN") || name.includes("Royal")) {
             image = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop";
        }

        // Features
        let features = ["Free WiFi", "Breakfast Included"];
        if (price > 200) features.push("Ocean View", "Butler Service");

        // Stock Logic
        let stockTag = '';
        if (stock <= 2) {
            stockTag = `<span class="stock-tag low">Only ${stock} Left</span>`;
        } else {
            stockTag = `<span class="stock-tag">Available (${stock})</span>`;
        }

        const featuresHtml = features.map(f => `<li>${f}</li>`).join('');

        card.innerHTML = `
            <div class="room-image" style="background-image: url('${image}');">
                ${stockTag}
            </div>
            <div class="room-details">
                <h3>${name}</h3>
                <p class="price">$${price} <span>/ night</span></p>
                <ul class="features">
                    ${featuresHtml}
                </ul>
                <button class="btn-primary full-width" onclick="openBooking('${name}', ${price})">
                    Book Now
                </button>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
}

/**
 * Modal Logic
 */
function openBooking(roomName, price) {
    document.getElementById('modal-room-type').value = roomName;
    document.getElementById('modal-price').innerText = `$${price}.00`;
    currentPrice = price;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

/**
 * Handle Booking Submission
 */
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Processing Transaction...";
    submitBtn.disabled = true;

    const payload = {
        group_id: "demo",
        room_type: document.getElementById('modal-room-type').value,
        guest_name: document.getElementById('guest-name').value,
        guest_email: document.getElementById('guest-email').value,
        relation_to_host: document.getElementById('relation-host').value,
        room_price: currentPrice,
        booking_lead_time: 90, // Demo value
        origin_city: "New York", // Demo value
        agent_id: "web-direct"
    };

    try {
        const res = await fetch(`${API_BASE}/bookings/initiate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Booking Failed");
        }

        const data = await res.json();
        
        // Success! Redirect to Stripe or show success
        alert(`Booking Locked!\nRisk Score: ${data.risk_score}\nRedirecting to Payment...`);
        // In real app: window.location.href = data.checkout_url;
        console.log("Checkout URL:", data.checkout_url);
        
        closeModal();
    } catch (err) {
        alert(`Booking Error: ${err.message}`);
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
});

/**
 * Simulates Live Ticker Activity
 */
function startLiveTicker() {
    // Static for now
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchInventory();
    startLiveTicker();
});
