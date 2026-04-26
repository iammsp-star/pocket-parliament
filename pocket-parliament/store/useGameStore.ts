import { create } from 'zustand';

interface GameState {
  // Core Metrics
  turn: number;
  budget: number; // In millions
  politicalCapital: number; // Out of 100
  stability: number; // Out of 100
  
  // Economy Sectors (Percentages)
  sectors: {
    primary: number;
    secondary: number;
    tertiary: number;
  };

  // Actions
  nextTurn: () => void;
  makeDecision: (cost: number, capitalChange: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  // Starting State: Underdog Nation
  turn: 1,
  budget: -500, // Starting in debt
  politicalCapital: 30, // Low initial trust
  stability: 45, // Fragile state
  
  sectors: {
    primary: 70, // Mostly agrarian/mining
    secondary: 20,
    tertiary: 10,
  },

  nextTurn: () => set((state) => ({ turn: state.turn + 1 })),
  
  makeDecision: (cost, capitalChange) => set((state) => ({
    budget: state.budget - cost,
    politicalCapital: Math.max(0, Math.min(100, state.politicalCapital + capitalChange)),
  })),
}));
