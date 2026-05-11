'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'
import { useState } from 'react'

export default function SetupModal() {
  const { isSetupModalOpen, setupCountry } = useGameStore()
  const [formData, setFormData] = useState({
    countryName: 'Varantia',
    leaderTitle: 'Prime Minister',
    leaderName: 'Player',
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    flagEmoji: '🏛️',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setupCountry(formData)
  }

  return (
    <AnimatePresence>
      {isSetupModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg glass-bright rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-indigo-500/20"
            >
              <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 px-8 py-6 border-b border-white/10">
                <h1 className="text-display font-black text-2xl text-white">Pocket Parliament</h1>
                <p className="text-indigo-300 text-sm mt-1 font-medium">Initialize your nation&apos;s identity</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nation Name</label>
                    <input
                      type="text"
                      required
                      value={formData.countryName}
                      onChange={(e) => setFormData({ ...formData, countryName: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. United Republic"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leader Title</label>
                      <input
                        type="text"
                        required
                        value={formData.leaderTitle}
                        onChange={(e) => setFormData({ ...formData, leaderTitle: e.target.value })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="e.g. Prime Minister"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Leader Name</label>
                      <input
                        type="text"
                        required
                        value={formData.leaderName}
                        onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Flag Emoji</label>
                    <div className="flex gap-2">
                      {['🏛️', '🦅', '🦁', '🌟', '⚙️', '⚓', '🔰', '⚜️'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData({ ...formData, flagEmoji: emoji })}
                          className={`text-2xl p-3 rounded-xl transition-all ${
                            formData.flagEmoji === emoji 
                              ? 'bg-indigo-500/20 border-indigo-500 border shadow-lg shadow-indigo-500/20 scale-110' 
                              : 'bg-slate-900/50 border border-white/10 hover:bg-slate-800'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn-chunky btn-primary py-4 text-base"
                  >
                    Assume Office
                  </motion.button>
                  <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-semibold">
                    You are inheriting a debt crisis. Good luck.
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
