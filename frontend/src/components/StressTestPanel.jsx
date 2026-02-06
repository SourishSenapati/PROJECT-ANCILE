import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Server, Database, Globe, Lock } from 'lucide-react';

const StressTestPanel = () => {
    const [stats, setStats] = useState({
        rps: 1200,
        latency: 45,
        threatLevel: 'LOW',
        activeNodes: 142,
        load: 32
    });

    const [isStressTesting, setIsStressTesting] = useState(false);
    const [consoleLogs, setConsoleLogs] = useState([]);

    useEffect(() => {
        let interval;
        if (isStressTesting) {
            interval = setInterval(() => {
                setStats(prev => ({
                    rps: prev.rps + Math.floor(Math.random() * 2000),
                    latency: Math.min(prev.latency + Math.random() * 50, 400),
                    threatLevel: 'CRITICAL',
                    activeNodes: prev.activeNodes,
                    load: Math.min(prev.load + Math.random() * 10, 100)
                }));

                const logMessages = [
                    "Node 42 latency spike detected",
                    "APT-1 Neural Shield deploying countermeasures...",
                    "DDoS attack simulation: 10k bots",
                    "Encrypting data at rest...",
                    "Rerouting traffic to secure enclave...",
                    "Brute-force vector #42 active",
                    "Quantum key distribution engaged",
                    "Packet loss detected in Sector 7",
                    "Firewall integrity verified: 99.9%"
                ];

                const message = logMessages[Math.floor(Math.random() * logMessages.length)];
                const time = new Date().toLocaleTimeString().toLowerCase();
                
                setConsoleLogs(prev => [`[${time}] ${message}`, ...prev].slice(0, 8)); // Newest first

            }, 200); // Faster updates for intensity
        } else {
            setStats({
                rps: 1240,
                latency: 42,
                threatLevel: 'LOW',
                activeNodes: 142,
                load: 32
            });
            setConsoleLogs([]);
        }
        return () => clearInterval(interval);
    }, [isStressTesting]);

    return (
        <div className="mt-12 p-8 border border-red-500/20 rounded-2xl bg-red-950/5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-red-100 flex items-center gap-3">
                        <ShieldAlert className="text-red-500" />
                        Infrastructure Stress Test
                    </h3>
                    <p className="text-red-400/60 mt-2">Simulate state-level attacks and network overload to verify Ancile stability.</p>
                </div>
                <button 
                    onClick={() => setIsStressTesting(!isStressTesting)}
                    className={`px-6 py-3 rounded font-bold uppercase tracking-widest transition-all ${isStressTesting ? 'bg-red-500 text-black hover:bg-red-400' : 'border border-red-500 text-red-500 hover:bg-red-500/10'}`}
                >
                    {isStressTesting ? 'STOP SIMULATION' : 'INITIATE ATTACK'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Metric Cards */}
                <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Globe size={14} /> Requests/Sec</div>
                    <div className="text-3xl font-mono text-white">{stats.rps.toLocaleString()}</div>
                    <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.min(stats.rps / 100, 100)}%` }}></div>
                    </div>
                </div>

                <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Activity size={14} /> Global Latency</div>
                    <div className="text-3xl font-mono text-white">{stats.latency.toFixed(1)}ms</div>
                    <div className="text-xs text-gray-500 mt-2">Target: &lt;50ms</div>
                </div>

                <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Server size={14} /> Load Average</div>
                    <div className="text-3xl font-mono text-white">{stats.load.toFixed(1)}%</div>
                    <div className={`text-xs mt-2 ${stats.load > 80 ? 'text-red-400' : 'text-green-400'}`}>
                        {stats.load > 80 ? 'CRITICAL LOAD' : 'Optiminal'}
                    </div>
                </div>

                 <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1 flex items-center gap-2"><Lock size={14} /> Threat Level</div>
                    <div className={`text-3xl font-mono ${stats.threatLevel === 'LOW' ? 'text-green-500' : stats.threatLevel === 'CRITICAL' ? 'text-red-600' : 'text-yellow-500'}`}>
                        {stats.threatLevel}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">APT-1 Assessment</div>
                </div>
            </div>

            <div className={`mt-8 bg-black font-mono text-xs p-4 rounded-lg border border-white/10 h-32 overflow-hidden flex flex-col justify-end transition-opacity ${isStressTesting ? 'opacity-100' : 'opacity-50'}`}>
                {consoleLogs.map((log, i) => (
                    <div key={i} className="text-green-500/80 mb-1">
                        <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                ))}
                {!isStressTesting && <div className="text-gray-600">Waiting for simulation trigger...</div>}
            </div>
        </div>
    );
};

export default StressTestPanel;
