'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore, BriefChoice, AlertSeverity } from '@/store/gameStore'
import { X, Zap, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { useState } from 'react'

// ─── Severity Config ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  critical: {
    icon: <AlertCircle size={16} />,
    label: 'CRITICAL CRISIS',
    badge: 'severity-bg-critical',
    text: 'text-red-400',
    glow: 'shadow-red-500/20',
    border: 'border-red-500/30',
    headerBg: 'from-red-950/80 to-slate-950/90',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    label: 'URGENT BRIEF',
    badge: 'severity-bg-warning',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
    border: 'border-amber-500/30',
    headerBg: 'from-amber-950/80 to-slate-950/90',
  },
  info: {
    icon: <Info size={16} />,
    label: 'BRIEFING',
    badge: 'severity-bg-info',
    text: 'text-sky-400',
    glow: 'shadow-sky-500/20',
    border: 'border-sky-500/30',
    headerBg: 'from-sky-950/80 to-slate-950/90',
  },
}

// ─── Effect Preview ───────────────────────────────────────────────────────────

function EffectChip({ label, delta }: { label: string; delta: number }) {
  const positive = delta > 0
  const color = positive ? 'text-emerald-400' : 'text-red-400'
  const bg = positive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${bg} ${color}`}>
      {positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
      {positive ? '+' : ''}{delta} {label}
    </span>
  )
}

function parseEffects(choice: BriefChoice) {
  const chips: { label: string; delta: number }[] = []
  const { effects } = choice

  if (effects.politicalCapital) chips.push({ label: 'Pol. Capital', delta: effects.politicalCapital - (choice.cost || 0) })
  if (effects.factionApproval?.wealthy) chips.push({ label: 'Wealthy', delta: effects.factionApproval.wealthy })
  if (effects.factionApproval?.working) chips.push({ label: 'Working', delta: effects.factionApproval.working })
  if (effects.factionApproval?.nationalist) chips.push({ label: 'Nationalist', delta: effects.factionApproval.nationalist })
  if (effects.factionApproval?.youth) chips.push({ label: 'Youth', delta: effects.factionApproval.youth })
  if (effects.social?.education) chips.push({ label: 'Education', delta: effects.social.education })
  if (effects.social?.healthcare) chips.push({ label: 'Healthcare', delta: effects.social.healthcare })
  if (effects.economic?.gdpGrowthRate) chips.push({ label: 'GDP Growth', delta: effects.economic.gdpGrowthRate })
  if (effects.budget?.debtToGDP) chips.push({ label: 'Debt/GDP', delta: effects.budget.debtToGDP })

  return chips
}

// ─── Choice Card ──────────────────────────────────────────────────────────────

function ChoiceCard({
  choice,
  isSelected,
  onSelect,
  politicalCapital,
}: {
  choice: BriefChoice
  isSelected: boolean
  onSelect: () => void
  politicalCapital: number
}) {
  const canAfford = !choice.requiredCapital || politicalCapital >= (choice.requiredCapital || 0)
  const effectChips = parseEffects(choice)

  return (
    <motion.button
      layout
      onClick={canAfford ? onSelect : undefined}
      whileHover={canAfford ? { scale: 1.015, y: -2 } : {}}
      whileTap={canAfford ? { scale: 0.98 } : {}}
      className={`
        w-full text-left rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden
        ${isSelected
          ? 'border-indigo-500/60 bg-indigo-950/50 shadow-lg shadow-indigo-500/20'
          : canAfford
            ? 'border-white/8 bg-slate-900/60 hover:border-white/15 hover:bg-slate-800/60'
            : 'border-white/4 bg-slate-900/30 opacity-50 cursor-not-allowed'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          layoutId="selected"
          className="absolute inset-0 rounded-2xl border-2 border-indigo-400/60 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-2.5">
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all
          ${isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'}`}>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-white"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-display font-bold text-sm text-white leading-tight">{choice.label}</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{choice.description}</p>
        </div>
      </div>

      {/* Effect chips */}
      {effectChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {effectChips.map((chip, i) => (
            <EffectChip key={i} {...chip} />
          ))}
        </div>
      )}

      {/* Cost indicator */}
      {choice.cost && choice.cost > 0 && (
        <div className={`mt-2 flex items-center gap-1.5 text-[11px] ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
          <Zap size={10} />
          <span className="font-semibold">Costs {choice.cost} Political Capital</span>
          {!canAfford && <span className="text-red-400">(Insufficient Capital)</span>}
        </div>
      )}
    </motion.button>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function BriefModal() {
  // Optimize re-renders by only subscribing to needed state
  // Using useShallow prevents re-render if unselected state changes
  const { isBriefModalOpen, currentBrief, closeBrief, applyChoice, politicalCapital, turn } = useGameStore(useShallow((s) => ({
    isBriefModalOpen: s.isBriefModalOpen,
    currentBrief: s.currentBrief,
    closeBrief: s.closeBrief,
    applyChoice: s.applyChoice,
    politicalCapital: s.politicalCapital,
    turn: s.turn,
  })))
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const severity = currentBrief?.severity || 'info'
  const config = SEVERITY_CONFIG[severity]

  const handleConfirm = () => {
    const choice = currentBrief?.choices.find(c => c.id === selectedChoiceId)
    if (choice) {
      setIsConfirming(true)
      setTimeout(() => {
        applyChoice(choice)
        setSelectedChoiceId(null)
        setIsConfirming(false)
      }, 500)
    }
  }

  const handleClose = () => {
    setSelectedChoiceId(null)
    setIsConfirming(false)
    closeBrief()
  }

  return (
    <AnimatePresence>
      {isBriefModalOpen && currentBrief && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center pb-6 px-4"
          >
            <div className={`
              w-full max-w-2xl glass-bright rounded-3xl overflow-hidden
              border shadow-2xl ${config.border} ${config.glow}
            `}
              style={{ maxHeight: '82vh' }}
            >
              {/* Header */}
              <div className={`relative bg-gradient-to-r ${config.headerBg} px-6 pt-6 pb-4 border-b border-white/5`}>
                <div className="flex items-start gap-4">
                  {/* Severity badge */}
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${config.badge} ${config.text} flex-shrink-0 mt-0.5`}>
                    {config.icon}
                    {config.label}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-display font-black text-lg text-white leading-tight">
                      {currentBrief.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Turn {currentBrief.turn} · Strategic Decision Required</p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="p-2 rounded-xl btn-ghost flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  {currentBrief.description}
                </p>
              </div>

              {/* Choices */}
              <div className="p-5 space-y-3 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
                  Select Your Response
                </p>

                {currentBrief.choices.map((choice) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    isSelected={selectedChoiceId === choice.id}
                    onSelect={() => setSelectedChoiceId(choice.id)}
                    politicalCapital={politicalCapital}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 text-xs text-slate-500">
                  <Zap size={12} className="text-amber-400" />
                  <span>Political Capital: <span className="text-amber-400 font-bold">{politicalCapital}</span></span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={selectedChoiceId ? { scale: 1.02, y: -1 } : {}}
                  onClick={handleClose}
                  className="btn-chunky btn-ghost px-5 py-2.5 text-sm"
                >
                  Defer Decision
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  whileHover={selectedChoiceId ? { scale: 1.03, y: -2 } : {}}
                  animate={selectedChoiceId ? {
                    boxShadow: ['0 4px 15px rgba(99,102,241,0.4)', '0 6px 25px rgba(99,102,241,0.6)', '0 4px 15px rgba(99,102,241,0.4)'],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  onClick={handleConfirm}
                  disabled={!selectedChoiceId || isConfirming}
                  className={`btn-chunky px-6 py-2.5 text-sm transition-all ${
                    selectedChoiceId ? 'btn-primary' : 'btn-ghost opacity-50 cursor-not-allowed'
                  }`}
                >
                  {isConfirming ? (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
                      Implementing...
                    </motion.span>
                  ) : (
                    '✅ Confirm Decision'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
