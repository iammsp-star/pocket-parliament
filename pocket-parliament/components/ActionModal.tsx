'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, AlertTriangle, X } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActionModal({ isOpen, onClose }: ActionModalProps) {
  const { turn, makeDecision, nextTurn } = useGameStore();

  const handleDecision = (choice: 'invest' | 'ignore') => {
    if (choice === 'invest') {
      makeDecision(5, 5); // Cost 5M budget, gain 5 political capital
    } else {
      makeDecision(0, -10); // Cost 0 budget, lose 10 political capital
    }
    nextTurn();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-0 pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 pointer-events-auto"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full sm:max-w-lg bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl pointer-events-auto relative z-10 mx-4 sm:mb-0 mb-0"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500/20 p-3 rounded-xl text-amber-500">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Daily Brief: Turn {turn}</h2>
                <p className="text-sm text-zinc-400 font-medium">Urgent Executive Decision</p>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 mb-8">
              <p className="text-zinc-300 leading-relaxed text-sm">
                Miners in the primary sector are protesting lack of modern equipment. If we ignore them, the nationalist faction will lose faith in your leadership. If we invest, it will put a strain on our already tight budget.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handleDecision('ignore')}
                className="flex flex-col items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl p-4 transition-colors border border-zinc-700"
              >
                <span className="font-bold">Ignore Protest</span>
                <span className="text-xs text-rose-400">-10 Political Capital</span>
              </button>
              
              <button 
                onClick={() => handleDecision('invest')}
                className="flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-4 transition-colors border border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                <span className="font-bold">Invest in Mining</span>
                <span className="text-xs text-emerald-300">-$5M / +5 Cap</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
