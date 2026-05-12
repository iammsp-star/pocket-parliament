'use client'

import TopNav from '@/components/TopNav'
import Sidebar from '@/components/Sidebar'
import IsometricMap from '@/components/IsometricMap'
import BriefModal from '@/components/BriefModal'
import SetupModal from '@/components/SetupModal'
import TutorialOverlay from '@/components/TutorialOverlay'
import { useGameStore } from '@/store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Toast / Event Log Overlay ──────────────────────────────────────────────

function EventToasts() {
  const { eventLog } = useGameStore()

  return (
    <div className="absolute bottom-6 right-6 z-40 pointer-events-auto">
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-4 w-[340px] h-64 flex flex-col">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Info size={14} className="text-slate-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Intel Ticker</h3>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
          <AnimatePresence>
            {eventLog.map((event) => {
              let Icon = Info
              let color = 'text-sky-400'
              let bg = 'bg-sky-500/10'

              if (event.severity === 'critical') {
                Icon = AlertCircle
                color = 'text-red-400'
                bg = 'bg-red-500/10'
              } else if (event.severity === 'warning') {
                Icon = AlertTriangle
                color = 'text-amber-400'
                bg = 'bg-amber-500/10'
              }

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border border-white/5 ${bg} shadow-sm`}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon size={14} className={`${color} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className={`text-[9px] font-bold uppercase tracking-wider ${color} mb-0.5`}>
                        Turn {event.turn}
                      </p>
                      <p className="text-slate-200 text-[11px] leading-relaxed">{event.message}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Review Next Brief Floating Button ────────────────────────────────────────

function ActionFooter() {
  const { pendingBriefs, turn, openBrief } = useGameStore()
  const pendingCount = pendingBriefs.filter(b => b.turn <= turn).length

  if (pendingCount === 0) return null

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
      <motion.button
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={openBrief}
        className="btn-chunky btn-primary px-8 py-4 text-base pulse-ring relative"
      >
        <span className="relative z-10 flex items-center gap-2">
          Review Next Brief
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs ml-2">
            {pendingCount} Pending
          </span>
        </span>
      </motion.button>
    </div>
  )
}

// ─── Main Game Layout ────────────────────────────────────────────────────────

export default function GameBoard() {
  const { gamePhase, isTutorialActive, tutorialStep, _hasHydrated } = useGameStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !_hasHydrated) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Loading Save...</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex relative overflow-hidden bg-slate-950">
      <TutorialOverlay />

      <div className={`transition-all duration-500 ${isTutorialActive && tutorialStep === 1 ? 'relative z-[70] pointer-events-auto' : 'z-10'}`}>
        <TopNav />
      </div>
      
      <div className={`transition-all duration-500 ${isTutorialActive && tutorialStep === 3 ? 'relative z-[70] pointer-events-auto shadow-2xl' : 'z-10'}`}>
        <Sidebar />
      </div>
      
      <div className={`flex-1 relative transition-all duration-500 ${isTutorialActive && tutorialStep === 2 ? 'z-[70] pointer-events-auto' : 'z-0'}`}>
        <IsometricMap />
        <ActionFooter />
        <EventToasts />
      </div>

      <BriefModal />
      <SetupModal />

      {/* Game Over Overlay */}
      <AnimatePresence>
        {(gamePhase === 'game-over' || gamePhase === 'game_over_lost' || gamePhase === 'impeached') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md bg-slate-900/80 p-8 border border-white/10 rounded-3xl shadow-2xl"
            >
              {gamePhase === 'game_over_lost' && (
                <>
                  <h1 className="text-display font-black text-5xl text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">VOTED OUT</h1>
                  <p className="text-lg text-slate-300 mb-8">
                    You failed to secure the 272 seats needed. The opposition has formed a new government.
                  </p>
                </>
              )}
              {gamePhase === 'impeached' && (
                <>
                  <h1 className="text-display font-black text-5xl text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">IMPEACHED</h1>
                  <p className="text-lg text-slate-300 mb-8">
                    Your approval rating remained critically low for too long. Parliament has passed a vote of no confidence.
                  </p>
                </>
              )}
              {gamePhase === 'game-over' && (
                <>
                  <h1 className="text-display font-black text-5xl text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">LAME DUCK</h1>
                  <p className="text-lg text-slate-300 mb-8">
                    You have exhausted all Political Capital. The factions have united against you, and your government has collapsed.
                  </p>
                </>
              )}
              <button
                onClick={() => window.location.reload()}
                className="btn-chunky btn-primary px-8 py-3 w-full"
              >
                Start New Term
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
