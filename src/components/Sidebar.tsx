'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, formatCurrency, getApprovalColor } from '@/store/gameStore'
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
} from 'recharts'
import { Tractor, Factory, Cpu, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const SECTOR_COLORS = {
  primary: '#f97316',
  secondary: '#6366f1',
  tertiary: '#06b6d4',
  unemployed: '#475569',
}

const FACTION_CONFIG = {
  wealthy: { label: 'Wealthy Elite', emoji: '💼', color: '#fbbf24' },
  working: { label: 'Working Class', emoji: '🔧', color: '#60a5fa' },
  nationalist: { label: 'Nationalists', emoji: '🏛️', color: '#f87171' },
  youth: { label: 'Youth & Students', emoji: '🎓', color: '#34d399' },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-bright rounded-xl p-3 text-xs border border-white/10">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Sidebar() {
  const {
    isSidebarOpen,
    activeTab,
    setActiveTab,
    laborDemographics,
    budget,
    economicMetrics,
    socialMetrics,
    factionApproval,
    gdpHistory,
    approvalHistory,
    ministries,
    geopolitics,
    activeLaws,
    politicalCapital,
    overallApproval,
    appointMinister,
    setMinistryBudget,
    setDefcon,
    passLaw,
  } = useGameStore()

  const laborData = [
    { name: 'Agriculture', value: laborDemographics.primary, color: SECTOR_COLORS.primary },
    { name: 'Industry', value: laborDemographics.secondary, color: SECTOR_COLORS.secondary },
    { name: 'Services', value: laborDemographics.tertiary, color: SECTOR_COLORS.tertiary },
    { name: 'Unemployed', value: laborDemographics.unemployed, color: SECTOR_COLORS.unemployed },
  ]

  const gdpChartData = gdpHistory.map(h => ({
    turn: `T${h.turn > 0 ? h.turn : h.turn}`,
    GDP: h.gdp,
    year: h.year,
  }))

  const approvalChartData = approvalHistory.map(h => ({
    turn: `T${h.turn}`,
    Wealthy: h.wealthy,
    Working: h.working,
    Nationalist: h.nationalist,
    Youth: h.youth,
    Overall: h.overall,
  }))

  const tabs = [
    { id: 'labor', label: '👷 Labor' },
    { id: 'economy', label: '📈 Economy' },
    { id: 'social', label: '🏥 Social' },
    { id: 'diplomacy', label: '🤝 Factions' },
    { id: 'cabinet', label: '🏛️ Cabinet' },
    { id: 'geopolitics', label: '🌍 Geopolitics' },
    { id: 'laws', label: '📜 Laws' },
  ] as const

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 flex-shrink-0 flex flex-col glass-bright border-r border-white/5 overflow-hidden"
        >
          {/* Tab selector */}
          <div className="flex gap-1 p-3 border-b border-white/5 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`sidebar-tab flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'labor' && <LaborTab data={laborData} />}
                {activeTab === 'economy' && <EconomyTab gdpData={gdpChartData} budget={budget} economic={economicMetrics} />}
                {activeTab === 'social' && <SocialTab social={socialMetrics} />}
                {activeTab === 'diplomacy' && <FactionsTab factions={factionApproval} history={approvalChartData} />}
                {activeTab === 'cabinet' && <CabinetTab ministries={ministries} appointMinister={appointMinister} setMinistryBudget={setMinistryBudget} pc={politicalCapital} />}
                {activeTab === 'geopolitics' && <GeopoliticsTab geopolitics={geopolitics} setDefcon={setDefcon} />}
                {activeTab === 'laws' && <LawsTab activeLaws={activeLaws} passLaw={passLaw} pc={politicalCapital} approval={overallApproval} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// ─── Labor Tab ────────────────────────────────────────────────────────────────

function LaborTab({ data }: { data: any[] }) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Workforce Distribution" subtitle="Labor sector allocation" />

      {/* Donut Chart */}
      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {(data as any[]).map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="glass-bright rounded-xl px-3 py-2 text-xs border border-white/10">
                      <p className="font-bold text-white">{payload[0].name}</p>
                      <p style={{ color: (payload[0].payload as any).color }} className="font-semibold">
                        {Number(payload[0].value).toFixed(1)}% of workforce
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-display font-black text-xl text-white">{(data as any[])[0].value}%</p>
            <p className="text-[10px] text-slate-400">Primary</p>
          </div>
        </div>
      </div>

      {/* Legend bars */}
      {(data as any[]).map((sector: any) => (
        <SectorBar key={sector.name} {...sector} />
      ))}

      {/* Warning */}
      {(data as any[])[0].value > 40 && (
        <div className="severity-bg-warning rounded-xl p-3">
          <p className="text-xs text-amber-300 font-semibold mb-0.5">⚠️ Primary-Heavy Economy</p>
          <p className="text-[11px] text-amber-200/70">Over 40% in agriculture limits GDP growth. Invest in education to migrate workers to higher-value sectors.</p>
        </div>
      )}
    </div>
  )
}

function SectorBar({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{name}</span>
        <span className="text-display font-bold text-xs" style={{ color }}>{value}%</span>
      </div>
      <div className="stat-bar">
        <motion.div
          className="stat-bar-fill"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </div>
  )
}

// ─── Economy Tab ──────────────────────────────────────────────────────────────

function EconomyTab({ gdpData, budget, economic }: any) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Economic Overview" subtitle="Key financial indicators" />

      {/* GDP Chart */}
      <div>
        <p className="text-xs text-slate-400 mb-2">GDP History</p>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gdpData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="turn" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}B`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="GDP" stroke="#6366f1" strokeWidth={2} fill="url(#gdpGradient)" name="GDP" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MiniMetric
          label="Growth Rate"
          value={`${economic.gdpGrowthRate > 0 ? '+' : ''}${economic.gdpGrowthRate.toFixed(1)}%`}
          color={economic.gdpGrowthRate > 0 ? '#22c55e' : '#ef4444'}
          icon={economic.gdpGrowthRate > 0 ? '📈' : '📉'}
        />
        <MiniMetric
          label="Inflation"
          value={`${economic.inflationRate.toFixed(1)}%`}
          color={economic.inflationRate > 5 ? '#ef4444' : economic.inflationRate > 3 ? '#f59e0b' : '#22c55e'}
          icon="🌡️"
        />
        <MiniMetric
          label="Trade Balance"
          value={formatCurrency(economic.tradeBalance)}
          color={economic.tradeBalance >= 0 ? '#22c55e' : '#ef4444'}
          icon={economic.tradeBalance >= 0 ? '🚢' : '📦'}
        />
        <MiniMetric
          label="Reserves"
          value={formatCurrency(budget.foreignReserves)}
          color="#60a5fa"
          icon="🏦"
        />
      </div>

      {/* Tax Rates */}
      <div className="space-y-2">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tax Rates</p>
        <TaxDisplay label="Income Tax" value={budget.incomeTaxRate} />
        <TaxDisplay label="Corporate Tax" value={budget.corporateTaxRate} />
        <TaxDisplay label="Tariff Rate" value={budget.tariffRate} />
      </div>
    </div>
  )
}

function MiniMetric({ label, value, color, icon }: any) {
  return (
    <div className="metric-card" style={{ '--before-color': color } as any}>
      <p className="text-[10px] text-slate-500 mb-1">{icon} {label}</p>
      <p className="text-display font-bold text-sm" style={{ color }}>{value}</p>
    </div>
  )
}

function TaxDisplay({ label, value }: { label: string; value: number }) {
  const color = value > 40 ? '#ef4444' : value > 25 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 stat-bar">
        <motion.div
          className="stat-bar-fill"
          style={{ backgroundColor: color, width: `${(value / 60) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / 60) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <span className="text-display font-bold text-xs" style={{ color }}>{value}%</span>
    </div>
  )
}

// ─── Social Tab ───────────────────────────────────────────────────────────────

const SOCIAL_METRICS_CONFIG = [
  { key: 'education', label: 'Education', emoji: '🎓', higher: true },
  { key: 'healthcare', label: 'Healthcare', emoji: '🏥', higher: true },
  { key: 'crime', label: 'Crime Rate', emoji: '🚨', higher: false },
  { key: 'corruption', label: 'Corruption', emoji: '💸', higher: false },
  { key: 'infrastructure', label: 'Infrastructure', emoji: '🏗️', higher: true },
  { key: 'environmentQuality', label: 'Environment', emoji: '🌿', higher: true },
] as const

function SocialTab({ social }: { social: any }) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Social Fabric" subtitle="Quality of life indicators" />

      <div className="space-y-3">
        {SOCIAL_METRICS_CONFIG.map(({ key, label, emoji, higher }) => {
          const rawValue = social[key]
          const displayValue = higher ? rawValue : 100 - rawValue
          const isGood = higher ? rawValue >= 60 : rawValue <= 40
          const isBad = higher ? rawValue < 40 : rawValue > 60
          const color = isGood ? '#22c55e' : isBad ? '#ef4444' : '#f59e0b'

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{emoji} {label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-display font-bold text-xs" style={{ color }}>{rawValue}</span>
                  {isBad && <span className="text-red-400 text-[10px]">⚠</span>}
                  {isGood && <span className="text-emerald-400 text-[10px]">✓</span>}
                </div>
              </div>
              <div className="stat-bar">
                <motion.div
                  className="stat-bar-fill"
                  style={{ backgroundColor: color, width: `${rawValue}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${rawValue}%` }}
                  transition={{ duration: 0.8, delay: 0.05 * SOCIAL_METRICS_CONFIG.findIndex(m => m.key === key) }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Crime-Education Loop Warning */}
      {social.education < 45 && social.crime > 55 && (
        <div className="severity-bg-critical rounded-xl p-3 mt-2">
          <p className="text-xs text-red-300 font-bold mb-1">🔴 Crime-Education Spiral Active</p>
          <p className="text-[11px] text-red-200/70">Low education is fueling crime and addiction loops. Immediate investment needed or economic sectors will lock down.</p>
        </div>
      )}
    </div>
  )
}

// ─── Factions Tab ─────────────────────────────────────────────────────────────

function FactionsTab({ factions, history }: { factions: any; history: any[] }) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Faction Approval" subtitle="Political coalition dynamics" />

      <div className="space-y-3">
        {(Object.entries(FACTION_CONFIG) as [string, any][]).map(([key, config]) => {
          const value = factions[key]
          const color = getApprovalColor(value)
          return (
            <div key={key} className="metric-card">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.emoji}</span>
                  <span className="text-xs font-semibold text-slate-300">{config.label}</span>
                </div>
                <span className="text-display font-black text-sm" style={{ color }}>{value}%</span>
              </div>
              <div className="stat-bar">
                <motion.div
                  className="stat-bar-fill"
                  style={{ backgroundColor: color, width: `${value}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Approval History chart */}
      {history.length > 1 && (
        <div>
          <p className="text-xs text-slate-400 mb-2">Approval Trends</p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="turn" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                {Object.entries(FACTION_CONFIG).map(([key, config]) => (
                  <Line key={key} type="monotone" dataKey={key.charAt(0).toUpperCase() + key.slice(1)}
                    stroke={config.color} strokeWidth={1.5} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Cabinet Tab ───────────────────────────────────────────────────────────────

function CabinetTab({ ministries, appointMinister, setMinistryBudget, pc }: any) {
  const ministerConfig = [
    { key: 'defense', label: 'Defense Ministry', icon: '🛡️', color: '#ef4444' },
    { key: 'health', label: 'Health & Human Services', icon: '🏥', color: '#3b82f6' },
    { key: 'education', label: 'Education & Science', icon: '🎓', color: '#eab308' },
    { key: 'foreignAffairs', label: 'Foreign Affairs', icon: '🌍', color: '#a855f7' },
  ]

  return (
    <div className="space-y-4">
      <SectionHeader title="Cabinet Ministers" subtitle="Allocate budgets and manage officials" />

      {ministerConfig.map((m) => {
        const min = ministries[m.key]
        return (
          <div key={m.key} className="metric-card space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-200">{m.icon} {m.label}</span>
              <span className="text-[10px] text-slate-400">Eff: <span className="text-white font-mono">{min.ministerEfficiency.toFixed(2)}x</span></span>
            </div>
            
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>Budget Allocation</span>
              <span>{min.allocatedBudget}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={min.allocatedBudget}
              onChange={(e) => setMinistryBudget(m.key, parseInt(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: m.color }}
            />
            
            <button
              onClick={() => appointMinister(m.key)}
              disabled={pc < 10}
              className="mt-2 w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-[10px] text-white rounded border border-white/10 transition-colors disabled:opacity-50 flex justify-between"
            >
              <span>Appoint New Minister</span>
              <span className="text-amber-400 font-bold">10 PC</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ─── Geopolitics Tab ─────────────────────────────────────────────────────────

function GeopoliticsTab({ geopolitics, setDefcon }: any) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Geopolitics" subtitle="Border tension & Defense Readiness" />

      <div className="metric-card text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Border Tension</p>
        <p className={`text-display font-black text-4xl ${geopolitics.borderTension > 80 ? 'text-red-500' : geopolitics.borderTension > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
          {geopolitics.borderTension.toFixed(0)}%
        </p>
        <div className="mt-4 stat-bar bg-slate-800">
          <motion.div
            className="stat-bar-fill"
            style={{ backgroundColor: geopolitics.borderTension > 80 ? '#ef4444' : geopolitics.borderTension > 50 ? '#f59e0b' : '#22c55e', width: `${geopolitics.borderTension}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${geopolitics.borderTension}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">If tension reaches 100%, a Border Conflict will occur.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">DEFCON Level</p>
        <div className="grid grid-cols-5 gap-1">
          {[5, 4, 3, 2, 1].map((level) => (
            <button
              key={level}
              onClick={() => setDefcon(level)}
              className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                geopolitics.defconLevel === level
                  ? level === 1 ? 'bg-red-500 border-red-400 text-white animate-pulse' : level <= 3 ? 'bg-amber-500 border-amber-400 text-black' : 'bg-emerald-500 border-emerald-400 text-black'
                  : 'bg-slate-800 border-white/10 text-slate-500 hover:bg-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Lower DEFCON = High Military Spending & Tension Deterrence</p>
      </div>
    </div>
  )
}

// ─── Laws Tab ─────────────────────────────────────────────────────────────────

import { LAWS } from '@/data/laws'

function LawsTab({ activeLaws, passLaw, pc, approval }: any) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Constitution & Laws" subtitle="Pass ideological decrees" />
      
      <div className="metric-card bg-slate-900 border border-slate-700">
        <p className="text-[10px] text-slate-400 text-center">Lok Sabha Voting Power</p>
        <p className="text-display font-bold text-lg text-center text-emerald-400">~{approval}% Success Chance</p>
      </div>

      <div className="space-y-3">
        {LAWS.map((law) => {
          const isActive = activeLaws.includes(law.id)
          return (
            <div key={law.id} className={`p-3 rounded-xl border ${isActive ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-slate-800/50 border-white/10'}`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold ${isActive ? 'text-indigo-300' : 'text-slate-200'}`}>📜 {law.name}</span>
                {isActive ? (
                  <span className="text-[9px] uppercase font-bold text-emerald-400 px-1.5 py-0.5 bg-emerald-500/20 rounded">Active</span>
                ) : (
                  <span className="text-[9px] uppercase font-bold text-amber-400">{law.cost} PC</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">{law.description}</p>
              {!isActive && (
                <button
                  onClick={() => passLaw(law.id)}
                  disabled={pc < law.cost}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 text-[10px] text-white font-semibold rounded transition-colors"
                >
                  Propose to Lok Sabha
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h3 className="text-display font-bold text-sm text-white">{title}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  )
}
