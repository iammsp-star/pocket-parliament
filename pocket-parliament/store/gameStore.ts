import { create } from 'zustand';

interface GameState {
  turn: number;
  countryName: string;
  title: string;
  budget: number;
  debt: number;
  politicalCapital: number; // Max 100
  
  // Labor Demographics
  primarySector: number; // %
  secondarySector: number; // %
  tertiarySector: number; // %
  unemployment: number; // %
  
  // Methods
  nextTurn: () => void;
  updateBudget: (amount: number) => void;
  updatePoliticalCapital: (amount: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  turn: 1,
  countryName: 'Elbonia',
  title: 'Prime Minister',
  budget: 5000000,
  debt: 12000000,
  politicalCapital: 30, // Starts low for an underdog
  
  // Underdog demographics: High primary sector, low tertiary
  primarySector: 55,
  secondarySector: 25,
  tertiarySector: 10,
  unemployment: 10,
  
  nextTurn: () => set((state) => ({ turn: state.turn + 1 })),
  updateBudget: (amount) => set((state) => ({ budget: state.budget + amount })),
  updatePoliticalCapital: (amount) => 
    set((state) => ({ 
      politicalCapital: Math.max(0, Math.min(100, state.politicalCapital + amount)) 
    })),
}));
