'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore, formatCurrency } from '@/store/gameStore'
import {
  Landmark,
  Zap,
  TrendingUp,
  TrendingDown,
  Shield,
  Globe2,
  Menu,
  Bell,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { useMemo } from 'react'

const getPCColor = (pc: number) => {
  if (pc >= 60) return { text: 'text-emerald-400', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30' }
  if (pc >= 30) return { text: 'text-amber-400', bg: 'bg-amber-500', glow: 'shadow-amber-500/30' }
  return { text: 'text-red-400', bg: 'bg-red-500', glow: 'shadow-red-500/40' }
}

const getDeficitColor = (deficit: number) => deficit >= 0 ? 'text-emerald-400' : 'text-red-400'

export default function TopNav() {
  // Optimize re-renders by only subscribing to needed state
  // Using useShallow prevents re-render if unselected state changes
  const {
    countryName,
    leaderTitle,
    leaderName,
    flagEmoji,
    turn,
    year,
    politicalCapital,
    maxPoliticalCapital,
    isLameDuck,
    budget,
    overallApproval,
    globalRank,
    pendingBriefs,
    eventLog,
    toggleSidebar,
    advanceTurn,
    openBrief,
  } = useGameStore(useShallow((s) => ({
    countryName: s.countryName,
    leaderTitle: s.leaderTitle,
    leaderName: s.leaderName,
    flagEmoji: s.flagEmoji,
    turn: s.turn,
    year: s.year,
    politicalCapital: s.politicalCapital,
    maxPoliticalCapital: s.maxPoliticalCapital,
    isLameDuck: s.isLameDuck,
    budget: s.budget,
    overallApproval: s.overallApproval,
    globalRank: s.globalRank,
    pendingBriefs: s.pendingBriefs,
    eventLog: s.eventLog,
    toggleSidebar: s.toggleSidebar,
    advanceTurn: s.advanceTurn,
    openBrief: s.openBrief,
  })))

  const pcColors = getPCColor(politicalCapital)
  const pcPercent = (politicalCapital / maxPoliticalCapital) * 100

  const pendingCount = pendingBriefs.filter(b => b.turn <= turn).length
  const hasCritical = eventLog.slice(0, 5).some(e => e.severity === 'critical')

  const approvalColor = useMemo(() => {
    if (overallApproval >= 60) return 'text-emerald-400'
    if (overallApproval >= 40) return 'text-amber-400'
    return 'text-red-400'
  }, [overallApproval])

  return (
    <header className="relative z-50 flex items-center h-16 px-4 gap-3 glass-bright border-b border-white/5">
      {/* Sidebar toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={toggleSidebar}
        className="btn-chunky btn-ghost p-2.5 rounded-xl"
        title="Toggle Sidebar"
      >
        <Menu size={18} />
      </motion.button>

      {/* Brand / Country Identity */}
      <div className="flex items-center gap-2.5 mr-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-2xl select-none"
        >
          {flagEmoji}
        </motion.div>
        <div className="leading-tight">
          <p className="text-display font-bold text-white text-sm leading-none">{countryName}</p>
          <p className="text-mono text-xs text-slate-400 leading-none mt-0.5">
            {leaderTitle} <span className="text-slate-300">{leaderName}</span>
          </p>
        </div>
      </div>

      <div className="h-8 w-px bg-white/8 mx-1" />

      {/* Turn & Year */}
      <div className="flex items-center gap-1.5 glass rounded-xl px-3 py-1.5">
        <ChevronRight size={13} className="text-indigo-400" />
        <span className="text-mono text-xs text-slate-400">Turn</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={turn}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="text-display font-bold text-white text-sm"
          >
            {turn}
          </motion.span>
        </AnimatePresence>
        <span className="text-mono text-xs text-slate-500 ml-1">/ {year}</span>
      </div>

      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        {/* GDP */}
        <StatPill
          icon={<Landmark size={13} className="text-sky-400" />}
          label="GDP"
          value={formatCurrency(budget.totalGDP)}
          sub={
            <span className={budget.deficit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {budget.deficit >= 0 ? '+' : ''}{formatCurrency(budget.deficit)}/q
            </span>
          }
          color="sky"
        />

        {/* Debt/GDP */}
        <StatPill
          icon={<TrendingUp size={13} className={budget.debtToGDP > 80 ? 'text-red-400' : budget.debtToGDP > 60 ? 'text-amber-400' : 'text-emerald-400'} />}
          label="Debt/GDP"
          value={`${budget.debtToGDP.toFixed(0)}%`}
          valueClass={budget.debtToGDP > 80 ? 'text-red-400' : budget.debtToGDP > 60 ? 'text-amber-400' : 'text-emerald-400'}
          color="red"
        />

        {/* Political Capital */}
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 min-w-[160px]">
          <Zap size={13} className={pcColors.text} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-mono text-xs text-slate-400">Pol. Capital</span>
              <span className={`text-display font-bold text-xs ${pcColors.text}`}>
                {politicalCapital}/{maxPoliticalCapital}
              </span>
            </div>
            <div className="stat-bar">
              <motion.div
                className="stat-bar-fill"
                style={{
                  width: `${pcPercent}%`,
                  background: `linear-gradient(90deg, #ef4444 0%, #f59e0b 40%, #22c55e 100%)`,
                  backgroundSize: `${(maxPoliticalCapital / politicalCapital) * 100}% 100%`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pcPercent}%` }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
          </div>
          {isLameDuck && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-xs text-red-400 font-bold"
            >
              LAME DUCK
            </motion.span>
          )}
        </div>

        {/* Approval */}
        <StatPill
          icon={<Shield size={13} className={approvalColor} />}
          label="Approval"
          value={`${overallApproval}%`}
          valueClass={approvalColor}
          color="green"
        />

        {/* Global Rank */}
        <StatPill
          icon={<Globe2 size={13} className="text-purple-400" />}
          label="Global Rank"
          value={`#${globalRank}`}
          valueClass="text-purple-400"
          color="purple"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Pending alerts */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={openBrief}
          className="relative p-2.5 rounded-xl btn-chunky btn-ghost"
        >
          <Bell size={16} className={hasCritical ? 'text-red-400' : 'text-slate-400'} />
          {pendingCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none"
              style={{ width: 18, height: 18 }}
            >
              {pendingCount}
            </motion.span>
          )}
        </motion.button>

        {/* Advance Turn */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03, y: -1 }}
          onClick={advanceTurn}
          className="btn-chunky btn-ghost px-3 py-2 text-xs gap-1.5"
        >
          <ChevronRight size={14} className="text-indigo-400" />
          <span className="text-display font-semibold text-slate-300">Next Turn</span>
        </motion.button>
      </div>
    </header>
  )
}

// ─── Stat Pill ─────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: React.ReactNode
  valueClass?: string
  color: string
}

function StatPill({ icon, label, value, sub, valueClass = 'text-white' }: StatPillProps) {
  return (
    <div className="flex items-center gap-2 glass rounded-xl px-3 py-1.5">
      {icon}
      <div className="leading-tight">
        <p className="text-mono text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            <motion.p
              key={value}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className={`text-display font-bold text-sm ${valueClass}`}
            >
              {value}
            </motion.p>
          </AnimatePresence>
          {sub && <span className="text-[10px]">{sub}</span>}
        </div>
      </div>
    </div>
  )
}
