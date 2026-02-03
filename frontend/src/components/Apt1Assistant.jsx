import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, Shield, Cpu, Zap, Layers, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
    "Find properties with BR6 Glass",
    "Compare security specs for Davos",
    "Draft extraction protocol for Tokyo",
    "Analyze threat level in New York"
];

const Apt1Assistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { type: 'agent', text: 'APT-1 Neural Link active. I am monitoring global threat vectors. How can I assist your mission?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [thoughtProcess, setThoughtProcess] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, thoughtProcess]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg = { type: 'user', text: query };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsTyping(true);

        // Simulate Agentic Chain of Thought
        const steps = [
            "Parsing intent...",
            "Querying secure inventory database...",
            `Cross-referencing threat intel for "${userMsg.text}"...`,
            "Optimizing logistics...",
        ];

        for (let i = 0; i < steps.length; i++) {
            setThoughtProcess(steps[i]);
            await new Promise(r => setTimeout(r, 800));
        }

        setThoughtProcess(null);
        setIsTyping(false);

        // Simulated Context-Aware Response
        let responseText = "I've updated your view. Based on your request, I strongly recommend the Obsidian Tower.";
        if (userMsg.text.toLowerCase().includes('compare')) responseText = "Generating comparison matrix. The Alpine Chalet offers superior kinetic protection, but the Kyoto Fortress has better cyber-shielding.";
        if (userMsg.text.toLowerCase().includes('davos')) responseText = "Davos usage is high. I have reserved 3 hold-back units in Sector 4. Shall I release them to your account?";

        setMessages(prev => [...prev, { type: 'agent', text: responseText }]);
    };

    return (
        <>
            {/* Expanded Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-[#0f0f12]/95 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                        style={{ boxShadow: '0 0 50px rgba(212, 175, 55, 0.1)' }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#d4af37]/10 to-transparent flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-ping absolute"></div>
                                    <Cpu size={20} className="text-[#d4af37] relative z-10" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">APT-1 Agent</h3>
                                    <div className="text-[10px] text-[#d4af37] font-mono tracking-wider">ONLINE // TIER 0 ACCESS</div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                                        msg.type === 'user' 
                                            ? 'bg-[#d4af37] text-black font-medium rounded-br-none' 
                                            : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            
                            {/* Chain of Thought Visualization */}
                            {thoughtProcess && (
                                <div className="flex justify-start">
                                    <motion.div 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }}
                                        className="bg-black/40 border border-[#d4af37]/20 p-3 rounded-xl max-w-[85%] text-xs font-mono text-[#d4af37]/80 flex items-center gap-2"
                                    >
                                        <Layers size={12} className="animate-pulse" />
                                        {thoughtProcess}
                                    </motion.div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggestions */}
                        {messages.length === 1 && !thoughtProcess && (
                            <div className="px-4 pb-2">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Capabilities</p>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => { setQuery(s); handleSend(); }}
                                            className="text-xs bg-white/5 hover:bg-[#d4af37]/20 hover:text-[#d4af37] border border-white/10 text-gray-400 px-3 py-1.5 rounded-full transition-colors truncate max-w-full"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Command APT-1..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!query.trim() || isTyping}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#d4af37] text-black rounded-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Orb Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 transition-all ${
                    isOpen ? 'bg-transparent pointer-events-none opacity-0' : 'bg-black border border-[#d4af37] opacity-100'
                }`}
                style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)' }}
            >   
                <div className="absolute inset-0 rounded-full border border-[#d4af37] animate-ping opacity-20"></div>
                <Sparkles size={24} className="text-[#d4af37]" />
            </motion.button>
        </>
    );
};

export default Apt1Assistant;
