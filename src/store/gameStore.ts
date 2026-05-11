import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// ─── Types ─────────────────────────────────────────────────────────────────

export type Faction = 'wealthy' | 'working' | 'nationalist' | 'youth'
export type Sector = 'primary' | 'secondary' | 'tertiary'
export type AlertSeverity = 'info' | 'warning' | 'critical'
export type DiplomacyTier = 'neutral' | 'well-wisher' | 'pact' | 'ally'

export interface FactionApproval {
  wealthy: number     // 0-100
  working: number
  nationalist: number
  youth: number
}

export interface Ministry {
  allocatedBudget: number // percentage 0-100
  ministerEfficiency: number // 0.5 to 1.5
}

export interface Geopolitics {
  borderTension: number // 0-100
  militaryPower: number
  defconLevel: number // 5 down to 1
}

export interface LaborDemographics {
  primary: number     // percentage of workforce
  secondary: number
  tertiary: number
  unemployed: number
}

export interface Budget {
  totalGDP: number            // in millions USD
  revenue: number             // monthly revenue
  expenditure: number         // monthly expenditure
  deficit: number             // revenue - expenditure (negative = deficit)
  debtToGDP: number           // percentage
  foreignReserves: number     // millions USD
  incomeTaxRate: number       // percentage
  corporateTaxRate: number    // percentage
  tariffRate: number          // percentage
}

export interface SocialMetrics {
  education: number         // 0-100
  healthcare: number
  crime: number             // 0-100 (higher = worse)
  corruption: number        // 0-100 (higher = worse)
  infrastructure: number    // 0-100
  environmentQuality: number
}

export interface EconomicMetrics {
  gdpGrowthRate: number       // percentage
  inflationRate: number       // percentage
  unemployment: number        // percentage
  tradeBalance: number        // millions USD (negative = deficit)
  softPower: number           // 0-100
  tourism: number             // 0-100
  militaryStrength: number    // 0-100
  technologicalAdvancement: number // 0-100
}

export interface GameBrief {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  choices: BriefChoice[]
  consequences?: string
  turn: number
}

export interface BriefChoice {
  id: string
  label: string
  description: string
  effects: Partial<{
    politicalCapital: number
    budget: Partial<Budget>
    social: Partial<SocialMetrics>
    economic: Partial<EconomicMetrics>
    factionApproval: Partial<FactionApproval>
    labor: Partial<LaborDemographics>
  }>
  cost?: number               // political capital cost
  requiredCapital?: number
}

export interface GameEvent {
  id: string
  message: string
  severity: AlertSeverity
  turn: number
  timestamp: number
}

export interface AIRival {
  id: string
  name: string
  flag: string
  gdp: number
  militaryStrength: number
  softPower: number
  diplomacyTier: DiplomacyTier
  color: string
}

export interface GameState {
  // ─── National Identity ───────────────────────────────────────────────
  countryName: string
  leaderTitle: string
  leaderName: string
  primaryColor: string
  secondaryColor: string
  flagEmoji: string

  // ─── Turn & Phase ────────────────────────────────────────────────────
  turn: number
  gamePhase: 'setup' | 'playing' | 'crisis' | 'game-over' | 'victory' | 'game_over_lost' | 'game_over_won' | 'impeached'
  year: number

  // ─── Political Capital ───────────────────────────────────────────────
  politicalCapital: number
  maxPoliticalCapital: number
  isLameDuck: boolean
  executiveOrdersUsed: number

  // ─── Core Economy ────────────────────────────────────────────────────
  budget: Budget
  laborDemographics: LaborDemographics
  economicMetrics: EconomicMetrics
  socialMetrics: SocialMetrics

  // ─── Factions ────────────────────────────────────────────────────────
  factionApproval: FactionApproval
  overallApproval: number   // computed from factions
  activeDebuffs: string[]
  consecutiveLowApproval: number

  // ─── Modern Age Systems ──────────────────────────────────────────────
  ministries: {
    defense: Ministry
    health: Ministry
    education: Ministry
    foreignAffairs: Ministry
  }
  geopolitics: Geopolitics
  activeLaws: string[]
  intelActive: number // turns remaining for intel
  turnsUntilElection: number

  // ─── Events & Briefs ─────────────────────────────────────────────────
  currentBrief: GameBrief | null
  pendingBriefs: GameBrief[]
  eventLog: GameEvent[]
  isBriefModalOpen: boolean
  isSetupModalOpen: boolean

  // ─── Rivals ──────────────────────────────────────────────────────────
  rivals: AIRival[]
  globalRank: number

  // ─── UI State ────────────────────────────────────────────────────────
  isSidebarOpen: boolean
  activeTab: 'labor' | 'economy' | 'social' | 'diplomacy' | 'cabinet' | 'geopolitics' | 'laws'

  // ─── GDP History (for charts) ─────────────────────────────────────────
  gdpHistory: { turn: number; gdp: number; year: number }[]
  approvalHistory: { turn: number; overall: number; wealthy: number; working: number; nationalist: number; youth: number }[]

  // ─── Actions ─────────────────────────────────────────────────────────
  setupCountry: (config: {
    countryName: string
    leaderTitle: string
    leaderName: string
    primaryColor: string
    secondaryColor: string
    flagEmoji: string
  }) => void
  advanceTurn: () => void
  openBrief: () => void
  closeBrief: () => void
  applyChoice: (choice: BriefChoice) => void
  toggleSidebar: () => void
  setActiveTab: (tab: GameState['activeTab']) => void
  addEvent: (message: string, severity: AlertSeverity) => void
  adjustTax: (type: 'income' | 'corporate' | 'tariff', value: number) => void
  openSetupModal: () => void
  closeSetupModal: () => void
  setDefcon: (level: number) => void
  appointMinister: (ministry: keyof GameState['ministries']) => void
  setMinistryBudget: (ministry: keyof GameState['ministries'], budget: number) => void
  passLaw: (lawId: string) => void
  fundIntelligence: () => void
}

// ─── Starting State (Underdog Nation) ────────────────────────────────────────

const STARTING_BRIEFS: GameBrief[] = [
  {
    id: 'brief-001',
    title: 'The Debt Crisis Inheritance',
    description:
      'Your predecessor left you a poisoned chalice. The national debt stands at 87% of GDP. International creditors are demanding austerity measures. The IMF has offered a structural adjustment loan — but it comes with strict conditions that will slash public spending.',
    severity: 'critical',
    turn: 1,
    choices: [
      {
        id: 'accept-imf',
        label: '🏦 Accept IMF Bailout',
        description: 'Accept the loan. Cut education and healthcare by 15%. Stabilize debt short-term.',
        effects: {
          politicalCapital: -15,
          budget: { debtToGDP: -8, revenue: 120000 },
          social: { education: -8, healthcare: -10 },
          factionApproval: { working: -18, youth: -12, wealthy: 10 },
          economic: { gdpGrowthRate: -0.8 },
        },
        cost: 15,
      },
      {
        id: 'reject-imf',
        label: '✊ Reject Austerity — Stimulus Now',
        description: 'Reject IMF terms. Issue domestic bonds. Invest in infrastructure to grow your way out.',
        effects: {
          politicalCapital: 10,
          budget: { debtToGDP: 4, expenditure: 80000 },
          social: { infrastructure: 8 },
          factionApproval: { working: 15, youth: 8, nationalist: 12, wealthy: -10 },
          economic: { gdpGrowthRate: 1.2, inflationRate: 1.5 },
        },
      },
      {
        id: 'negotiate-imf',
        label: '🤝 Negotiate Modified Terms',
        description: 'Push back on the harshest cuts. Accept partial loan with lighter conditions.',
        effects: {
          politicalCapital: 5,
          budget: { debtToGDP: -3, revenue: 60000 },
          social: { education: -3, healthcare: -4 },
          factionApproval: { working: -5, youth: -3, wealthy: 5 },
          economic: { gdpGrowthRate: 0.3 },
        },
        cost: 8,
      },
    ],
  },
  {
    id: 'brief-002',
    title: 'Agricultural Sector Strike',
    description:
      'Forty thousand farmers have blocked the capital\'s main highway. They demand guaranteed minimum crop prices amid falling commodity markets. Your Primary Sector employs 45% of the workforce — this cannot be ignored.',
    severity: 'warning',
    turn: 2,
    choices: [
      {
        id: 'price-floor',
        label: '🌾 Institute Price Floor',
        description: 'Guarantee minimum prices. Costs 8% of agricultural budget annually.',
        effects: {
          politicalCapital: 8,
          budget: { expenditure: 40000, deficit: -40000 },
          factionApproval: { working: 20, nationalist: 15, wealthy: -8 },
          economic: { tradeBalance: -20000 },
        },
        cost: 0,
      },
      {
        id: 'export-subsidies',
        label: '📦 Offer Export Subsidies Instead',
        description: 'Help farmers compete internationally. Less immediate relief but sustainable.',
        effects: {
          politicalCapital: 3,
          budget: { expenditure: 25000 },
          factionApproval: { working: 8, nationalist: 5, wealthy: 2 },
          economic: { tradeBalance: 15000, gdpGrowthRate: 0.4 },
        },
        cost: 5,
      },
    ],
  },
]

const INITIAL_RIVALS: AIRival[] = [
  { id: 'rival-1', name: 'Valdoria', flag: '🏴', gdp: 890000, militaryStrength: 72, softPower: 61, diplomacyTier: 'neutral', color: '#ef4444' },
  { id: 'rival-2', name: 'Celestia', flag: '🚩', gdp: 1200000, militaryStrength: 55, softPower: 85, diplomacyTier: 'neutral', color: '#8b5cf6' },
  { id: 'rival-3', name: 'Ironmark', flag: '⚑', gdp: 650000, militaryStrength: 88, softPower: 32, diplomacyTier: 'neutral', color: '#f59e0b' },
  { id: 'rival-4', name: 'New Solaria', flag: '🏳', gdp: 420000, militaryStrength: 45, softPower: 55, diplomacyTier: 'well-wisher', color: '#10b981' },
  { id: 'rival-5', name: 'Aquilinia', flag: '🎌', gdp: 1580000, militaryStrength: 90, softPower: 78, diplomacyTier: 'neutral', color: '#ec4899' },
]

const computeOverallApproval = (fa: FactionApproval): number =>
  Math.round((fa.wealthy * 0.2 + fa.working * 0.35 + fa.nationalist * 0.25 + fa.youth * 0.2))

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // National Identity
    countryName: 'Varantia',
    leaderTitle: 'Prime Minister',
    leaderName: 'You',
    primaryColor: '#6366f1',
    secondaryColor: '#f59e0b',
    flagEmoji: '🏛️',

    // Turn
    turn: 1,
    gamePhase: 'playing',
    year: 2024,

    // Tension & Fog of War
    turnsUntilElection: 20,
    consecutiveLowApproval: 0,
    intelActive: 0,
    activeDebuffs: [],

    // Political Capital
    politicalCapital: 42,
    maxPoliticalCapital: 100,
    isLameDuck: false,
    executiveOrdersUsed: 0,

    // Budget — Underdog starting state
    budget: {
      totalGDP: 380000,          // $380B GDP (small developing nation)
      revenue: 78000,            // $78B revenue
      expenditure: 95000,        // $95B spending — running a deficit
      deficit: -17000,           // $17B deficit
      debtToGDP: 87,             // 87% debt-to-GDP (crisis level)
      foreignReserves: 12000,    // $12B reserves (thin)
      incomeTaxRate: 22,
      corporateTaxRate: 18,
      tariffRate: 8,
    },

    // Labor Demographics — Primary-heavy (developing)
    laborDemographics: {
      primary: 45,      // 45% in agriculture/mining
      secondary: 28,    // 28% manufacturing
      tertiary: 21,     // 21% services/AI
      unemployed: 6,    // 6% unemployed
    },

    // Economic Metrics
    economicMetrics: {
      gdpGrowthRate: 1.2,
      inflationRate: 6.8,        // elevated inflation
      unemployment: 6.0,
      tradeBalance: -24000,      // trade deficit
      softPower: 18,             // very low soft power
      tourism: 12,               // minimal tourism
      militaryStrength: 31,      // weak military
      technologicalAdvancement: 14, // very low tech
    },

    // Social Metrics
    socialMetrics: {
      education: 38,
      healthcare: 42,
      crime: 61,               // high crime (linked to low education)
      corruption: 54,          // significant corruption
      infrastructure: 29,      // poor infrastructure
      environmentQuality: 45,
    },

    // Faction Approval
    factionApproval: {
      wealthy: 55,
      working: 31,
      nationalist: 47,
      youth: 28,
    },
    overallApproval: 39,

    // Modern Age Systems
    ministries: {
      defense: { allocatedBudget: 15, ministerEfficiency: 1.0 },
      health: { allocatedBudget: 25, ministerEfficiency: 1.0 },
      education: { allocatedBudget: 25, ministerEfficiency: 1.0 },
      foreignAffairs: { allocatedBudget: 10, ministerEfficiency: 1.0 },
    },
    geopolitics: {
      borderTension: 40,
      militaryPower: 31,
      defconLevel: 5,
    },
    activeLaws: [],

    // Events & Briefs
    currentBrief: null,
    pendingBriefs: STARTING_BRIEFS,
    eventLog: [
      { id: 'e-1', message: 'You have assumed office. The nation is watching.', severity: 'info', turn: 1, timestamp: Date.now() },
      { id: 'e-2', message: 'Debt-to-GDP ratio at 87% — creditors are anxious.', severity: 'critical', turn: 1, timestamp: Date.now() + 1 },
      { id: 'e-3', message: 'High crime rate linked to education deficit. Intervention needed.', severity: 'warning', turn: 1, timestamp: Date.now() + 2 },
    ],
    isBriefModalOpen: false,
    isSetupModalOpen: true,

    // Rivals
    rivals: INITIAL_RIVALS,
    globalRank: 6,

    // UI
    isSidebarOpen: true,
    activeTab: 'labor',

    // History
    gdpHistory: [
      { turn: -5, gdp: 310000, year: 2019 },
      { turn: -4, gdp: 325000, year: 2020 },
      { turn: -3, gdp: 318000, year: 2021 },
      { turn: -2, gdp: 342000, year: 2022 },
      { turn: -1, gdp: 361000, year: 2023 },
      { turn: 1, gdp: 380000, year: 2024 },
    ],
    approvalHistory: [
      { turn: 1, overall: 39, wealthy: 55, working: 31, nationalist: 47, youth: 28 },
    ],

    // ─── Actions ────────────────────────────────────────────────────────

    setupCountry: (config) => set({
      countryName: config.countryName,
      leaderTitle: config.leaderTitle,
      leaderName: config.leaderName,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      flagEmoji: config.flagEmoji,
      isSetupModalOpen: false,
      gamePhase: 'playing',
    }),

    openBrief: () => {
      const state = get()
      const nextBrief = state.pendingBriefs.find(b => b.turn <= state.turn) || state.pendingBriefs[0]
      if (nextBrief) {
        set({ currentBrief: nextBrief, isBriefModalOpen: true })
      }
    },

    closeBrief: () => set({ isBriefModalOpen: false }),

    fundIntelligence: () => {
      const state = get()
      if (state.budget.revenue < 10000) return // Ensure enough money
      set({ 
        budget: { ...state.budget, revenue: state.budget.revenue - 10000 },
        intelActive: 4 
      })
      get().addEvent('Intelligence operation funded. Rival and faction data revealed for 1 year.', 'info')
    },

    applyChoice: (choice) => {
      const state = get()
      const { effects } = choice

      const newPC = Math.max(0, Math.min(
        state.maxPoliticalCapital,
        state.politicalCapital + (effects.politicalCapital || 0) - (choice.cost || 0)
      ))

      const newBudget = { ...state.budget, ...effects.budget }
      const newSocial = { ...state.socialMetrics, ...effects.social }
      const newEconomic = { ...state.economicMetrics, ...effects.economic }
      const newFA: FactionApproval = {
        wealthy: Math.max(0, Math.min(100, state.factionApproval.wealthy + (effects.factionApproval?.wealthy || 0))),
        working: Math.max(0, Math.min(100, state.factionApproval.working + (effects.factionApproval?.working || 0))),
        nationalist: Math.max(0, Math.min(100, state.factionApproval.nationalist + (effects.factionApproval?.nationalist || 0))),
        youth: Math.max(0, Math.min(100, state.factionApproval.youth + (effects.factionApproval?.youth || 0))),
      }
      const newLabor = { ...state.laborDemographics, ...effects.labor }
      const newOverall = computeOverallApproval(newFA)

      // Remove the current brief from pending
      const newPending = state.pendingBriefs.filter(b => b.id !== state.currentBrief?.id)

      // Log event
      const event: GameEvent = {
        id: `e-${Date.now()}`,
        message: `Decision made: ${choice.label}`,
        severity: 'info',
        turn: state.turn,
        timestamp: Date.now(),
      }

      set({
        politicalCapital: newPC,
        isLameDuck: newPC === 0,
        budget: newBudget,
        socialMetrics: newSocial,
        economicMetrics: newEconomic,
        factionApproval: newFA,
        laborDemographics: newLabor,
        overallApproval: newOverall,
        pendingBriefs: newPending,
        currentBrief: null,
        isBriefModalOpen: false,
        eventLog: [event, ...state.eventLog].slice(0, 50),
        gamePhase: newPC === 0 ? 'game-over' : state.gamePhase,
      })
    },

    advanceTurn: () => {
      const state = get()
      if (state.gamePhase === 'game_over_lost' || state.gamePhase === 'game_over_won' || state.gamePhase === 'impeached') return

      const newTurn = state.turn + 1
      const newYear = newTurn % 4 === 0 ? state.year + 1 : state.year

      // ─── Intel & Election Timers ─────────────────────────────────────────
      const newIntelActive = Math.max(0, state.intelActive - 1)
      let newTurnsUntilElection = state.turnsUntilElection - 1
      let newConsecutiveLowApproval = state.overallApproval < 15 ? state.consecutiveLowApproval + 1 : 0
      let newGamePhase: GameState['gamePhase'] = state.gamePhase
      let bonusPC = 0
      const eventsToLog: GameEvent[] = []

      // Impeachment check
      if (newConsecutiveLowApproval >= 3) {
        newGamePhase = 'impeached'
      }

      // Election check
      if (newTurnsUntilElection <= 0 && newGamePhase !== 'impeached') {
        if (state.overallApproval >= 50) {
          // Win election
          newTurnsUntilElection = 20
          bonusPC = 50
          eventsToLog.push({ id: `e-${Date.now()}-win`, message: 'You won re-election! +50 Political Capital.', severity: 'info', turn: newTurn, timestamp: Date.now() })
        } else {
          // Lose election
          newGamePhase = 'game_over_lost'
        }
      }

      // ─── Faction Retaliation & Debuffs ──────────────────────────────────
      const newActiveDebuffs: string[] = []
      let revenueMult = 1.0
      let borderTensionPenalty = 0
      let techPenalty = 0
      let deficitPenalty = 0

      if (state.factionApproval.working < 25) {
        newActiveDebuffs.push('National Strike')
        revenueMult = 0.2 // 80% drop in revenue
      }
      if (state.factionApproval.wealthy < 25) { // Corporates equivalent
        newActiveDebuffs.push('Capital Flight')
        deficitPenalty = 50000 // Massive deficit penalty
      }
      if (state.factionApproval.nationalist < 25) {
        newActiveDebuffs.push('Border Vulnerability')
        borderTensionPenalty = 15
      }
      if (state.factionApproval.youth < 25) {
        newActiveDebuffs.push('Brain Drain')
        techPenalty = 2
      }

      // ─── Apply Laws Multipliers ─────────────────────────────────────────
      let popGrowthMult = 1.0
      let secondaryGrowthMult = 1.0
      
      if (state.activeLaws.includes('law-free-healthcare')) popGrowthMult = 1.5
      if (state.activeLaws.includes('law-corp-deregulation')) secondaryGrowthMult = 2.0

      // ─── Economic Tick ──────────────────────────────────────────────────
      const gdpGrowth = (state.economicMetrics.gdpGrowthRate / 100) * secondaryGrowthMult
      const newGDP = Math.round(state.budget.totalGDP * (1 + gdpGrowth))
      
      const defconCostMult = { 5: 1, 4: 1.2, 3: 1.5, 2: 2.0, 1: 3.0 }[state.geopolitics.defconLevel] || 1
      const militarySpending = (state.budget.expenditure * (state.ministries.defense.allocatedBudget / 100)) * defconCostMult
      const totalExpenditure = state.budget.expenditure + (militarySpending - (state.budget.expenditure * (state.ministries.defense.allocatedBudget / 100)))

      const newRevenue = state.budget.revenue * revenueMult
      const newDeficit = newRevenue - totalExpenditure - deficitPenalty
      const newDebtToGDP = Math.max(0, state.budget.debtToGDP + (newDeficit < 0 ? 2 : -1))

      // ─── Political Capital ──────────────────────────────────────────────
      const pcRecovery = state.overallApproval > 50 ? 3 : state.overallApproval > 30 ? 1 : -2
      const newPC = Math.max(0, Math.min(state.maxPoliticalCapital, state.politicalCapital + pcRecovery + bonusPC))

      // ─── Ministry effects on Social Metrics ─────────────────────────────
      const getChange = (min: Ministry) => (min.allocatedBudget - 15) * 0.1 * min.ministerEfficiency
      const newSocial = { ...state.socialMetrics }
      newSocial.healthcare = Math.max(0, Math.min(100, newSocial.healthcare + getChange(state.ministries.health) * popGrowthMult))
      newSocial.education = Math.max(0, Math.min(100, newSocial.education + getChange(state.ministries.education)))
      
      const newEconomic = { ...state.economicMetrics }
      newEconomic.technologicalAdvancement = Math.max(0, newEconomic.technologicalAdvancement - techPenalty)

      // ─── Geopolitics ────────────────────────────────────────────────────
      const faEffect = state.ministries.foreignAffairs.allocatedBudget * 0.05 * state.ministries.foreignAffairs.ministerEfficiency
      const defconEffect = state.geopolitics.defconLevel < 5 ? (5 - state.geopolitics.defconLevel) * 2 : -1
      let newBorderTension = Math.max(0, state.geopolitics.borderTension - faEffect - defconEffect + borderTensionPenalty)
      
      if (newBorderTension >= 100) {
        newBorderTension = 50 // Reset somewhat
        eventsToLog.push({ id: `e-${Date.now()}-conflict`, message: 'BORDER CONFLICT! The military has clashed with enemy forces.', severity: 'critical', turn: newTurn, timestamp: Date.now() })
        newSocial.infrastructure -= 10
      }

      const newGdpHistory = [...state.gdpHistory, { turn: newTurn, gdp: newGDP, year: newYear }].slice(-20)
      const newApprovalHistory = [...state.approvalHistory, {
        turn: newTurn,
        overall: state.overallApproval,
        ...state.factionApproval,
      }].slice(-20)

      const newBudget = {
        ...state.budget,
        totalGDP: newGDP,
        deficit: newDeficit,
        debtToGDP: newDebtToGDP,
      }

      const newEventLog = [...eventsToLog, ...state.eventLog].slice(0, 50)

      set({
        turn: newTurn,
        year: newYear,
        budget: newBudget,
        politicalCapital: newPC,
        socialMetrics: newSocial,
        economicMetrics: newEconomic,
        isLameDuck: newPC === 0,
        gdpHistory: newGdpHistory,
        approvalHistory: newApprovalHistory,
        eventLog: newEventLog,
        geopolitics: { ...state.geopolitics, borderTension: newBorderTension },
        gamePhase: newGamePhase,
        turnsUntilElection: newTurnsUntilElection,
        consecutiveLowApproval: newConsecutiveLowApproval,
        intelActive: newIntelActive,
        activeDebuffs: newActiveDebuffs,
      })
    },

    toggleSidebar: () => set(s => ({ isSidebarOpen: !s.isSidebarOpen })),
    setActiveTab: (tab) => set({ activeTab: tab }),

    addEvent: (message, severity) => {
      const state = get()
      const event: GameEvent = {
        id: `e-${Date.now()}`,
        message,
        severity,
        turn: state.turn,
        timestamp: Date.now(),
      }
      set({ eventLog: [event, ...state.eventLog].slice(0, 50) })
    },

    adjustTax: (type, value) => {
      const state = get()
      const budget = { ...state.budget }
      if (type === 'income') budget.incomeTaxRate = Math.max(0, Math.min(60, value))
      else if (type === 'corporate') budget.corporateTaxRate = Math.max(0, Math.min(50, value))
      else if (type === 'tariff') budget.tariffRate = Math.max(0, Math.min(40, value))

      // Recompute revenue approximately
      const revMultiplier = (budget.incomeTaxRate / 22) * 0.5 + (budget.corporateTaxRate / 18) * 0.3 + (budget.tariffRate / 8) * 0.2
      budget.revenue = Math.round(78000 * revMultiplier)
      budget.deficit = budget.revenue - budget.expenditure

      set({ budget })
    },

    openSetupModal: () => set({ isSetupModalOpen: true }),
    closeSetupModal: () => set({ isSetupModalOpen: false }),

    setDefcon: (level) => set((state) => ({ geopolitics: { ...state.geopolitics, defconLevel: level } })),
    
    appointMinister: (ministryKey) => set((state) => {
      if (state.politicalCapital < 10) return state
      const newEfficiency = 0.5 + Math.random() // 0.5 to 1.5
      return {
        politicalCapital: state.politicalCapital - 10,
        ministries: {
          ...state.ministries,
          [ministryKey]: { ...state.ministries[ministryKey], ministerEfficiency: newEfficiency }
        }
      }
    }),

    setMinistryBudget: (ministryKey, budget) => set((state) => ({
      ministries: {
        ...state.ministries,
        [ministryKey]: { ...state.ministries[ministryKey], allocatedBudget: budget }
      }
    })),

    passLaw: (lawId) => set((state) => {
      if (state.activeLaws.includes(lawId)) return state
      // Simulate parliamentary vote - cost 20 PC
      if (state.politicalCapital < 20) return state
      
      const successChance = state.overallApproval // Approval rating roughly translates to vote success percentage
      const roll = Math.random() * 100

      if (roll <= successChance) {
        return {
          politicalCapital: state.politicalCapital - 20,
          activeLaws: [...state.activeLaws, lawId],
          eventLog: [{ id: `law-${Date.now()}`, message: 'Law successfully passed the Lok Sabha!', severity: 'info' as AlertSeverity, turn: state.turn, timestamp: Date.now() }, ...state.eventLog].slice(0, 50)
        }
      } else {
        return {
          politicalCapital: state.politicalCapital - 20,
          eventLog: [{ id: `law-${Date.now()}`, message: 'Law failed to pass the Lok Sabha!', severity: 'warning' as AlertSeverity, turn: state.turn, timestamp: Date.now() }, ...state.eventLog].slice(0, 50)
        }
      }
    }),
  }))
)

// ─── Utility selectors ────────────────────────────────────────────────────────

export const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}T`
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}B`
  return `$${value.toFixed(0)}M`
}

export const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'critical': return 'text-red-400'
    case 'warning': return 'text-amber-400'
    case 'info': return 'text-sky-400'
  }
}

export const getApprovalColor = (value: number): string => {
  if (value >= 65) return '#22c55e'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}
