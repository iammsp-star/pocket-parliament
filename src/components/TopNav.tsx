'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
  AlertCircle,
} from 'lucide-react'
import { useMemo } from 'react'

const getPCColor = (pc: number) => {
  if (pc >= 60) return { text: 'text-emerald-400', bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30' }
  if (pc >= 30) return { text: 'text-amber-400', bg: 'bg-amber-500', glow: 'shadow-amber-500/30' }
  return { text: 'text-red-400', bg: 'bg-red-500', glow: 'shadow-red-500/40' }
}

const getDeficitColor = (deficit: number) => deficit >= 0 ? 'text-emerald-400' : 'text-red-400'

export default function TopNav() {
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
    isSidebarOpen,
    advanceTurn,
    openBrief,
    geopolitics,
  } = useGameStore()

  const pcColors = getPCColor(politicalCapital)
  const pcPercent = (politicalCapital / maxPoliticalCapital) * 100

  const pendingCount = pendingBriefs.filter(b => b.turn <= turn).length
  const hasCritical = useGameStore((s) => s.pendingBriefs.some((b) => b.severity === 'critical'))
  const turnsUntilElection = useGameStore((s) => s.turnsUntilElection)
  const activeDebuffs = useGameStore((s) => s.activeDebuffs)

  const approvalColor = useMemo(() => {
    if (overallApproval >= 60) return 'text-emerald-400'
    if (overallApproval >= 40) return 'text-amber-400'
    return 'text-red-400'
  }, [overallApproval])

  return (
    <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none p-4 flex justify-between items-start gap-4">
      
      {/* LEFT PANEL: Identity */}
      <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2.5 shadow-2xl flex items-center gap-3">
        {/* Sidebar toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleSidebar}
          className="btn-chunky btn-ghost p-2 rounded-xl"
          title="Toggle Sidebar"
          aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <Menu size={18} />
        </motion.button>

        {/* Brand / Country Identity */}
        <div className="flex items-center gap-2 mr-1">
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

        <div className="h-8 w-px bg-white/10 mx-1" />

        {/* Global Rank */}
        <StatPill
          icon={<Globe2 size={13} className="text-purple-400" />}
          label="Global Rank"
          value={`#${globalRank}`}
          valueClass="text-purple-400"
          color="purple"
        />

        {/* Turn & Year */}
        <div className="flex items-center gap-1.5 bg-slate-800/50 rounded-xl px-3 py-1.5 border border-white/5">
          <ChevronRight size={13} className="text-indigo-400" />
          <span className="text-mono text-[10px] uppercase text-slate-400">Turn</span>
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

        <div className="h-8 w-px bg-white/10 mx-1" />
        
        {/* Election Countdown */}
        <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 border ${turnsUntilElection <= 3 ? 'bg-red-500/20 border-red-500/30' : 'bg-slate-800/50 border-white/5'}`}>
          <AlertCircle size={13} className={turnsUntilElection <= 3 ? 'text-red-400 animate-pulse' : 'text-slate-400'} />
          <span className="text-mono text-[10px] uppercase text-slate-400">Election in</span>
          <span className={`text-display font-bold text-sm ${turnsUntilElection <= 3 ? 'text-red-400' : 'text-white'}`}>{turnsUntilElection}</span>
        </div>
      </div>

      {/* CENTER PANEL: Economy & Debuffs */}
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2.5 shadow-2xl flex items-center gap-3">
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
        </div>

        {activeDebuffs.length > 0 && (
          <div className="flex gap-2">
            {activeDebuffs.map(debuff => (
              <div key={debuff} className="bg-red-950/80 backdrop-blur-md border border-red-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-900/20">
                <AlertTriangle size={12} className="text-red-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">{debuff}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Politics & Actions */}
      <div className="pointer-events-auto bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2.5 shadow-2xl flex items-center gap-3">
        {/* Political Capital */}
        <div className="flex items-center gap-2 bg-slate-800/50 border border-white/5 rounded-xl px-3 py-1.5 min-w-[140px]">
          <Zap size={13} className={pcColors.text} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-mono text-[10px] text-slate-400 uppercase">Pol. Capital</span>
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
              className="text-[10px] text-red-400 font-bold"
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

        {/* Threat Level */}
        <StatPill
          icon={<AlertTriangle size={13} className={geopolitics.defconLevel <= 3 || geopolitics.borderTension >= 80 ? 'text-red-400' : 'text-amber-400'} />}
          label="Threat"
          value={`DEFCON ${geopolitics.defconLevel}`}
          valueClass={geopolitics.defconLevel <= 3 ? 'text-red-400 animate-pulse' : 'text-amber-400'}
          color="red"
        />

        <div className="h-8 w-px bg-white/10 mx-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Pending alerts */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={openBrief}
            className="relative p-2.5 rounded-xl btn-chunky btn-ghost bg-slate-800/50"
            aria-label={`View Pending Briefs (${pendingCount} unread)`}
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
            className="btn-chunky btn-primary px-4 py-2 text-xs gap-1.5"
          >
            <ChevronRight size={14} className="text-white" />
            <span className="text-display font-semibold text-white">Next Turn</span>
          </motion.button>
        </div>
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
    <div className="flex items-center gap-2 bg-slate-800/50 border border-white/5 rounded-xl px-3 py-1.5">
      {icon}
      <div className="leading-tight">
        <p className="text-mono text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
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
