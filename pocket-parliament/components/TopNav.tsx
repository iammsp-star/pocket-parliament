'use client';

import { useGameStore } from '../store/useGameStore';
import { DollarSign, Landmark, TrendingDown, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopNav() {
  const { turn, budget, politicalCapital, stability } = useGameStore();
  const countryName = 'Elbonia';
  const title = 'Prime Minister';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 text-white flex items-center justify-between px-6 z-40 shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Landmark size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">{countryName}</h1>
          <p className="text-xs text-zinc-400 font-medium">{title}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-1.5 rounded-full border border-zinc-700/50">
          <DollarSign size={16} className={budget < 0 ? "text-rose-400" : "text-emerald-400"} />
          <span className={`font-mono font-medium ${budget < 0 ? "text-rose-400" : "text-emerald-400"}`}>{budget}M</span>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-1.5 rounded-full border border-zinc-700/50">
          <Users size={16} className={politicalCapital < 40 ? "text-rose-400" : "text-blue-400"} />
          <span className="font-mono font-medium text-white">{politicalCapital} <span className="text-zinc-500 text-xs ml-1">CAP</span></span>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-1.5 rounded-full border border-zinc-700/50">
          <TrendingDown size={16} className={stability < 50 ? "text-amber-400" : "text-emerald-400"} />
          <span className="font-mono font-medium text-white">{stability}% <span className="text-zinc-500 text-xs ml-1">STAB</span></span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400 font-bold uppercase tracking-wider">Turn</span>
        <div className="bg-zinc-100 text-zinc-900 font-bold px-3 py-1 rounded-md">
          {turn}
        </div>
      </div>
    </motion.header>
  );
}
