import { FactionApproval, EconomicMetrics } from '../store/gameStore'

export interface Law {
  id: string
  name: string
  description: string
  cost: number // Political Capital cost to propose
  effects: {
    factionApproval?: Partial<FactionApproval>
    economic?: Partial<EconomicMetrics>
    multipliers: {
      secondaryGrowth?: number
      populationGrowth?: number
      eventChance?: number
    }
  }
}

export const LAWS: Law[] = [
  {
    id: 'law-state-media',
    name: 'State-Controlled Media',
    description: 'Centralize media narrative. Halves random negative events but angers the youth.',
    cost: 20,
    effects: {
      factionApproval: { nationalist: 20, youth: -30 },
      multipliers: { eventChance: 0.5 }
    }
  },
  {
    id: 'law-free-healthcare',
    name: 'Universal Free Healthcare',
    description: 'Massive health boost and population growth, but drains the budget heavily.',
    cost: 30,
    effects: {
      factionApproval: { working: 40, wealthy: -20 },
      multipliers: { populationGrowth: 1.5 }
    }
  },
  {
    id: 'law-corp-deregulation',
    name: 'Corporate Deregulation',
    description: 'Remove red tape for businesses. Boosts secondary sector growth significantly.',
    cost: 25,
    effects: {
      factionApproval: { wealthy: 50, working: -20 },
      multipliers: { secondaryGrowth: 2.0 }
    }
  }
]
