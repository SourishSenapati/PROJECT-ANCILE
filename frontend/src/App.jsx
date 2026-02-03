import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import InventoryGrid from './components/InventoryGrid';
import PropertyDetailModal from './components/BookingModal';
import LiveTicker from './components/LiveTicker';
import AdminPanel from './components/AdminPanel';
import WorldMap from './components/WorldMap';
import TrustCenter from './components/TrustCenter';
import Apt1Assistant from './components/Apt1Assistant';
import EventMicrosite from './components/EventMicrosite';
import RewardsPanel from './components/RewardsPanel';

// ... imports ...

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleSearch = (location) => {
      console.log("Searching for:", location);
  };

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <main className="pt-24 px-6 max-w-[1440px] mx-auto space-y-24 pb-24">
        <Hero />
        <SearchBar onSearch={handleSearch} />
        <InventoryGrid onBook={handleBookClick} />
        <WorldMap />
        <RewardsPanel />
      </main>

      <TrustCenter />
      <LiveTicker />
      <Apt1Assistant />
      
      <AnimatePresence>
        {isModalOpen && (
            <PropertyDetailModal 
            room={selectedRoom} 
            onClose={() => setIsModalOpen(false)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
}


function App() {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/admin" element={<AdminPanel />} />
       <Route path="/event/:id" element={<EventMicrosite />} />
       <Route path="/events/davos" element={<EventMicrosite />} /> {/* Demo link */}
    </Routes>
  );
}

export default App;
