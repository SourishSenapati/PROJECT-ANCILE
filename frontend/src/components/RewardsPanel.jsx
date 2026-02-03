import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Gift, Star, CreditCard, Zap } from 'lucide-react';

const TIERS = [
    { name: 'Operative', min: 0, max: 9999, color: '#86868b', benefits: 'Standard booking access' },
    { name: 'Agent', min: 10000, max: 49999, color: '#9B59B6', benefits: '5% cashback, Priority support' },
    { name: 'Spectre', min: 50000, max: 99999, color: '#D4AF37', benefits: '10% cashback, Room upgrades, Concierge access' },
    { name: 'Phantom', min: 100000, max: Infinity, color: '#E5C14B', benefits: '15% cashback, Private transport, Diplomatic immunity assistance' }
];

const RewardsPanel = () => {
    const [points, setPoints] = useState(32500); // Demo value
    const [lifetimeSpend, setLifetimeSpend] = useState(128000);

    const currentTier = TIERS.find(t => points >= t.min && points <= t.max);
    const nextTier = TIERS.find(t => t.min > points);
    const progressToNext = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

    return (
        <div id="rewards" className="bg-gradient-to-br from-black/40 to-[#d4af37]/5 border border-white/10 rounded-2xl p-8 mt-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Award className="text-[#d4af37]" size={28} />
                        Ancile Rewards
                    </h3>
                    <p className="text-gray-400 text-sm">Earn points on every booking. Unlock elite benefits.</p>
                </div>
                <div className="px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full">
                    <span className="text-[#d4af37] font-mono font-bold text-sm">{currentTier.name.toUpperCase()}</span>
                </div>
            </div>

            {/* Points Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                >
                    <div className="flex justify-center mb-3">
                        <Star size={24} className="text-[#d4af37]" fill="#d4af37" />
                    </div>
                    <div className="text-3xl font-mono font-bold text-white mb-1">
                        {points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Available Points</div>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                >
                    <div className="flex justify-center mb-3">
                        <TrendingUp size={24} className="text-green-500" />
                    </div>
                    <div className="text-3xl font-mono font-bold text-white mb-1">
                        ${lifetimeSpend.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Lifetime Spend</div>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                >
                    <div className="flex justify-center mb-3">
                        <Zap size={24} className="text-yellow-500" />
                    </div>
                    <div className="text-3xl font-mono font-bold text-[#d4af37] mb-1">
                        {currentTier.name === 'Spectre' ? '10%' : currentTier.name === 'Agent' ? '5%' : '0%'}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Cashback Rate</div>
                </motion.div>
            </div>

            {/* Tier Progress */}
            {nextTier && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress to {nextTier.name}</span>
                        <span className="text-sm font-mono text-[#d4af37]">
                            {(nextTier.min - points).toLocaleString()} points needed
                        </span>
                    </div>
                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-200"
                        />
                    </div>
                </div>
            )}

            {/* Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {TIERS.map((tier, i) => {
                    const isActive = tier.name === currentTier.name;
                    return (
                        <motion.div 
                            key={tier.name}
                            whileHover={{ y: -4 }}
                            className={`relative p-4 rounded-xl border transition-all ${
                                isActive 
                                    ? 'bg-[#d4af37]/10 border-[#d4af37] shadow-lg shadow-[#d4af37]/20' 
                                    : 'bg-white/5 border-white/10 opacity-60'
                            }`}
                        >
                            {isActive && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#d4af37] rounded-full flex items-center justify-center">
                                    <Star size={14} fill="black" stroke="black" />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard size={16} style={{ color: tier.color }} />
                                <h4 className="font-bold" style={{ color: tier.color }}>{tier.name}</h4>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">
                                {tier.min.toLocaleString()}+ pts
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {tier.benefits}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Earning Guide */}
            <div className="mt-8 p-6 bg-black/20 border border-white/5 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Gift size={18} className="text-[#d4af37]" />
                    <h4 className="font-semibold text-white">How to Earn</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="text-[#d4af37] font-mono mb-1">+1 point / $1 spent</div>
                        <div className="text-gray-500">Standard bookings</div>
                    </div>
                    <div>
                        <div className="text-[#d4af37] font-mono mb-1">+5,000 bonus</div>
                        <div className="text-gray-500">Refer a new member</div>
                    </div>
                    <div>
                        <div className="text-[#d4af37] font-mono mb-1">+2x multiplier</div>
                        <div className="text-gray-500">Event/MICE bookings</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardsPanel;
