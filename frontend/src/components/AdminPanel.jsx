import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Lock, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';
import StressTestPanel from './StressTestPanel';
import GroupManager from './GroupManager';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                setIsAuthenticated(true);
            } else {
                alert('Invalid Credentials');
            }
        } catch (err) {
            console.error(err);
             // Demo fallback
             if(username === 'admin' && password === 'oyo-copy') setIsAuthenticated(true);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadStatus('Uploading...');
            const res = await fetch('/api/admin/upload-footage', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setUploadStatus(`Success! Uploaded to ${data.url}`);
            } else {
                setUploadStatus('Upload Failed');
            }
        } catch (err) {
            setUploadStatus(`Error: ${err.message}`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-[400px] p-8 bg-[#0f0f12] border border-[#d4af37] rounded-xl text-center">
                    <ShieldCheck size={48} className="text-[#d4af37] mx-auto mb-6" />
                    <h2 className="text-2xl text-white mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="w-full p-3 bg-white/5 border border-white/10 rounded text-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                         <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full p-3 bg-white/5 border border-white/10 rounded text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="w-full p-3 bg-[#d4af37] text-black font-bold uppercase rounded hover:bg-[#AA8C2C]">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <div className="pt-32 px-6 max-w-4xl mx-auto pb-24">
                <header className="mb-12 flex justify-between items-center">
                    <h1 className="text-4xl text-[#d4af37]">Property Administration</h1>
                    <div className="px-4 py-2 bg-green-900/30 text-green-400 border border-green-500/30 rounded-full flex items-center gap-2">
                        <Lock size={14} /> Secure Mode
                    </div>
                </header>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {/* Upload Card */}
                    <div className="p-6 bg-[#0f0f12] border border-white/10 rounded-xl hover:border-[#d4af37]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4 text-[#d4af37]">
                            <Upload />
                            <h3 className="text-xl font-semibold">Upload Room Footage</h3>
                        </div>
                        <p className="text-gray-400 mb-6 text-sm">
                            Upload verified video walkthroughs. Files are automatically processed by PrivacyShield.
                        </p>
                        
                        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#d4af37]/50 transition-colors">
                            <input 
                                type="file" 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                id="footage-upload"
                                accept="video/*,image/*"
                            />
                            <label htmlFor="footage-upload" className="cursor-pointer">
                                <span className="block text-gray-300 mb-2">Click to Browse</span>
                                <span className="text-xs text-gray-500">MP4, MOV, JPG (Max 50MB)</span>
                            </label>
                        </div>
                        {uploadStatus && <p className="mt-4 text-[#d4af37] text-sm">{uploadStatus}</p>}
                    </div>

                    {/* Stats Card */}
                    <div className="p-6 bg-[#0f0f12] border border-white/10 rounded-xl hover:border-[#d4af37]/50 transition-colors">
                        <h3 className="text-xl font-semibold mb-4 text-[#d4af37]">Live Occupancy</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                                <span>Royal Ocean Suite</span>
                                <span className="text-red-400 font-mono">100% Booked</span>
                            </div>
                             <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                                <span>Executive King</span>
                                <span className="text-yellow-400 font-mono">2 Units Left</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="text-gray-400 text-sm mb-2">Total Monthly Revenue</div>
                            <div className="text-3xl font-mono text-white">$124,500 <span className="text-green-400 text-sm">(+12%)</span></div>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-8">Partner Dashboard</h2>
                
                <GroupManager />

                {/* Stress Test Dashboard */}
                <StressTestPanel />
            </div>
        </div>
    );
};

export default AdminPanel;
