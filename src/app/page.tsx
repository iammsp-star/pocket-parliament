'use client'

import TopNav from '@/components/TopNav'
import Sidebar from '@/components/Sidebar'
import IsometricMap from '@/components/IsometricMap'
import BriefModal from '@/components/BriefModal'
import SetupModal from '@/components/SetupModal'
import { useGameStore } from '@/store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Info, AlertTriangle } from 'lucide-react'

// ─── Toast / Event Log Overlay ──────────────────────────────────────────────

function EventToasts() {
  const { eventLog } = useGameStore()
  // Only show the 3 most recent events
  const recentEvents = eventLog.slice(0, 3)

  return (
    <div className="absolute bottom-6 right-6 z-40 flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence>
        {recentEvents.map((event, idx) => {
          let Icon = Info
          let color = 'text-sky-400'
          let border = 'border-sky-500/20'
          let bg = 'bg-slate-900/80'

          if (event.severity === 'critical') {
            Icon = AlertCircle
            color = 'text-red-400'
            border = 'border-red-500/30'
            bg = 'bg-red-950/40'
          } else if (event.severity === 'warning') {
            Icon = AlertTriangle
            color = 'text-amber-400'
            border = 'border-amber-500/30'
            bg = 'bg-amber-950/40'
          }

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1 - idx * 0.2, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`event-item backdrop-blur-md border ${border} ${bg} shadow-lg pointer-events-auto`}
              style={{ maxWidth: '320px' }}
            >
              <Icon size={14} className={`${color} mt-0.5 flex-shrink-0`} />
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${color} mb-0.5`}>
                  Turn {event.turn}
                </p>
                <p className="text-slate-200">{event.message}</p>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
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
  const { gamePhase } = useGameStore()

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950">
      <TopNav />
      
      <main className="flex-1 flex relative overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 relative">
          <IsometricMap />
          <ActionFooter />
          <EventToasts />
        </div>
      </main>

      <BriefModal />
      <SetupModal />

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gamePhase === 'game-over' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md"
            >
              <h1 className="text-display font-black text-6xl text-red-500 mb-4">LAME DUCK</h1>
              <p className="text-xl text-slate-300 mb-8">
                You have exhausted all Political Capital. The factions have united against you, and your government has collapsed.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-chunky btn-primary px-8 py-3"
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
