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
    const [points, setPoints] = useState(32500);
    const [lifetimeSpend, setLifetimeSpend] = useState(128000);

    const currentTier = TIERS.find(t => points >= t.min && points <= t.max);
    const nextTier = TIERS.find(t => t.min > points);
    const progressToNext = nextTier ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

    const tierClass = `tier-${currentTier.name.toLowerCase()}`;

    return (
        <div id="rewards" className="relative py-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Membership Card */}
                <div className="lg:w-1/3">
                    <motion.div 
                        whileHover={{ rotateY: 5, rotateX: -5 }}
                        className={`aspect-[1.6/1] rounded-2xl p-8 flex flex-col justify-between border border-white/20 relative overflow-hidden tier-card-shadow gloss-effect ${tierClass}`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Status Level</div>
                                <div className="text-2xl font-bold tracking-tight">{currentTier.name.toUpperCase()}</div>
                            </div>
                            <Award size={32} className="opacity-80" />
                        </div>

                        <div className="mt-auto">
                            <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Member Entity</div>
                            <div className="text-xl font-mono tracking-widest mb-4">AGENT_32500_SECURE</div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">Verified Balance</div>
                                    <div className="text-lg font-bold">{points.toLocaleString()} pts</div>
                                </div>
                                <div className="h-10 w-16 bg-white/10 rounded backdrop-blur-sm border border-white/10 flex items-center justify-center">
                                    <div className="flex gap-1">
                                        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-xs text-gray-500 uppercase mb-1">Lifetime Spend</div>
                            <div className="text-lg font-bold text-white">${lifetimeSpend.toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-xs text-gray-500 uppercase mb-1">Cashback Rate</div>
                            <div className="text-lg font-bold text-green-500">{currentTier.name === 'Phantom' ? '15%' : currentTier.name === 'Spectre' ? '10%' : '5%'}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Tiers & Progress */}
                <div className="lg:w-2/3">
                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Tier Progression</h3>
                                <p className="text-sm text-gray-500">Advance to unlock diplomatic immunity assistance and private transport.</p>
                            </div>
                            {nextTier && (
                                <div className="text-right">
                                    <div className="text-xs text-[#d4af37] font-bold uppercase tracking-wider mb-1">Next: {nextTier.name}</div>
                                    <div className="text-xl font-bold white">{(nextTier.min - points).toLocaleString()} <span className="text-gray-500 text-xs font-normal">pts needed</span></div>
                                </div>
                            )}
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressToNext}%` }}
                                className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TIERS.map((tier) => {
                            const isActive = tier.name === currentTier.name;
                            const isLocked = points < tier.min;
                            return (
                                <div 
                                    key={tier.name}
                                    className={`p-6 rounded-xl border transition-all relative ${
                                        isActive 
                                            ? 'bg-white/10 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                                            : 'bg-white/5 border-white/10'
                                    } ${isLocked ? 'opacity-40' : 'opacity-100'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
                                                <Star size={18} style={{ color: tier.color }} fill={isLocked ? 'none' : tier.color} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{tier.name}</h4>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">{tier.min.toLocaleString()}+ pts</div>
                                            </div>
                                        </div>
                                        {isActive && <div className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase">Current</div>}
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{tier.benefits}</p>
                                    
                                    {!isLocked && !isActive && points > tier.min && (
                                        <div className="absolute top-4 right-4 text-green-500">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Earning Guide Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/5">
                {[
                    { label: 'Standard Bookings', value: '+1 point / $1', icon: CreditCard },
                    { label: 'Member Referrals', value: '+5,000 bonus', icon: Gift },
                    { label: 'Event Bookings', value: '+2x multiplier', icon: TrendingUp }
                ].map(item => (
                    <div key={item.label} className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <item.icon size={20} />
                        </div>
                        <div>
                            <div className="text-white font-bold">{item.value}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RewardsPanel;
