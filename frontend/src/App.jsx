import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Premium Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InventoryGrid from './components/InventoryGrid';
import Apt1Assistant from './components/Apt1Assistant';
import WorldMap from './components/WorldMap';
import RewardsPanel from './components/RewardsPanel';
import TrustCenter from './components/TrustCenter';
import SearchBar from './components/SearchBar';

// Admin & Concierge
import AdminPanel from './components/AdminPanel';
import ConciergePanel from './components/ConciergePanel';
import GroupManager from './components/GroupManager';
import StressTestPanel from './components/StressTestPanel';

// Booking Modal
import PropertyDetailModal from './components/BookingModal';

const LandingPage = () => {
  const [selectedProperty, setSelectedProperty] = React.useState(null);

  const handlePropertySelection = (prop) => {
    console.log(`[Neural Link] Property Selected: ${prop.name}`);
    // If prop is just a city name (from map), find a mock property
    if (typeof prop === 'string') {
        // Mock lookup just for the demo effect
        const mockProp = {
            id: 'map_selection',
            name: `Ancile Safehouse: ${prop}`,
            location: prop,
            rating: 5.0,
            price: 1500,
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
            tags: ["Map Selection", "Secure"],
            features: ["Helipad", "Bunker"]
        };
        setSelectedProperty(mockProp);
    } else {
        setSelectedProperty(prop);
    }
  };

  return (
    <div className="space-y-24 pb-24">
      <Hero />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32">
        <section id="search">
          <SearchBar />
        </section>
        
        <section id="inventory">
          <div className="flex flex-col mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Available Sanctuaries</h2>
            <p className="text-secondary text-base sm:text-lg">Real-time availability across our global network.</p>
          </div>
          <InventoryGrid onBook={handlePropertySelection} />
        </section>

        <section id="world-map">
          <WorldMap onSelectLocation={handlePropertySelection} />
        </section>

        <section id="trust">
          <TrustCenter />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <RewardsPanel />
          <StressTestPanel />
        </div>
      </div>

      <AnimatePresence>
        {selectedProperty && (
            <PropertyDetailModal 
                room={selectedProperty} 
                onClose={() => setSelectedProperty(null)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-deep text-primary selection:bg-gold-primary/30">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/concierge" element={<ConciergePanel />} />
          <Route path="/manage/:groupId" element={<GroupManager />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center">
              <div>
                <h1 className="text-4xl font-bold text-gold-primary mb-4">404</h1>
                <p className="text-secondary mb-8">Protocol entry point not found.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn-primary"
                >
                  Return to Base
                </button>
              </div>
            </div>
          } />
        </Routes>
      </AnimatePresence>

      <Apt1Assistant />
      
      <footer className="py-24 border-t border-subtle text-center text-tertiary text-sm">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col items-center gap-6">
            <div className="text-gold-primary font-bold tracking-widest uppercase mb-4">Ancile</div>
            <p className="max-w-md mx-auto opacity-50">
              The premier global network for secured luxury sanctuaries. 
              Protected by APT-1 Neural Defense.
            </p>
            
            {/* Legal & System Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs tracking-wider uppercase opacity-70">
                {['Privacy Policy', 'Terms of Service', 'Bug Bounty Program', 'System Archive'].map((item) => (
                    <a 
                        key={item}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            alert(`[ANCILE PROTOCOL]\nAccessing ${item}...\n\nResult: 204 No Content (Classified)`);
                        }}
                        className="hover:text-gold-primary hover:underline transition-all duration-300"
                    >
                        {item}
                    </a>
                ))}
            </div>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent mt-4" />
            <p>© 2026 Project Ancile. Protocol Zero-Trace Active.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
