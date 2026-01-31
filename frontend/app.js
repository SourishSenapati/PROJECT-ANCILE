/**
 * ANCILE Frontend Logic
 * Mocking the API for now to demonstrate UI dynamics.
 */

// Mock Data mimicking TBO + Ancile Inventory Structure
const MOCK_INVENTORY = [
    {
        id: "room_001",
        name: "Royal Ocean Suite",
        price: 450,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop",
        features: ["King Bed", "Ocean View", "Personal Butler", "Jacuzzi"],
        stock: 2,
        maxGuests: 2
    },
    {
        id: "room_002",
        name: "Executive King",
        price: 280,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
        features: ["King Bed", "City Skyline View", "Workstation", "Lounge Access"],
        stock: 5,
        maxGuests: 2
    },
    {
        id: "room_003",
        name: "Deluxe Twin",
        price: 195,
        currency: "USD",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
        features: ["Twin Beds", "Garden View", "Free WiFi", "Breakfast Incl."],
        stock: 12,
        maxGuests: 2
    }
];

const API_BASE = "http://localhost:8000";

// DOM Elements
const gridContainer = document.getElementById('room-grid');

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
        // Fallback to Mock if API is down
        console.log("Falling back to mock data...");
        renderInventory(MOCK_INVENTORY);
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
        
        // Normalize API vs Mock structure
        // API returns {room_type, price, remaining}
        // Mock returns {name, price, stock, image, features}
        
        const name = room.name || room.room_type || "Standard Room";
        const price = room.price || 0;
        const stock = room.stock !== undefined ? room.stock : room.remaining;
        
        // Images/Features map (Quick hack for prototype)
        let image = room.image;
        let features = room.features || ["King Bed", "WiFi"];
        
        if (!image) {
             if (name.includes("DELUXE")) {
                 image = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop";
             } else {
                 image = "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop";
             }
        }

        // Stock Logic
        let stockTag = '';
        if (stock <= 2) {
            stockTag = `<span class="stock-tag low">Only ${stock} Left</span>`;
        } else {
            stockTag = `<span class="stock-tag">Available (${stock})</span>`;
        }

        // Features List
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
                <button class="btn-primary full-width" onclick="initiateBooking('${name}')">
                    Book Now
                </button>
            </div>
        `;
        
        gridContainer.appendChild(card);
    });
}


/**
 * Mock Booking Initiation
 */
function initiateBooking(roomId) {
    alert(`Initiating Atomic Lock for Room: ${roomId}...\n(Backend Integration Pending)`);
}

/**
 * Simulates Live Ticker Activity
 */
function startLiveTicker() {
    const messages = [
        "User 0x7a... just secured a room (2s ago)",
        "3 Users currently viewing the Royal Suite",
        "Inventory Locked: 84%",
        "New Booking from London, UK",
        "APT-1 Risk Analysis: Low Risk detected"
    ];
    
    // In a real app, this would be a WebSocket feed
    // For now, we just static, but we could rotate them if needed.
    // The CSS is static, but dynamic updates could happen here.
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Attempt to fetch real data, fallback is inside the function
    fetchInventory();

    startLiveTicker();
});
