"use client";

import { useState, ReactNode } from "react";
import { useGameStore } from "@/store/useGameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, ThreeElements } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Banknote, Users, Activity, ChevronRight, X } from "lucide-react";



export default function Dashboard() {
  const { turn, budget, politicalCapital, stability, sectors, makeDecision, nextTurn } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDecision = (cost: number, capitalChange: number) => {
    makeDecision(cost, capitalChange);
    nextTurn();
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shadow-md z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white tracking-wide">POCKET PARLIAMENT</h1>
          <span className="bg-slate-700 px-3 py-1 rounded-full text-sm font-medium text-slate-300">
            Turn {turn}
          </span>
        </div>
        
        <div className="flex gap-6">
          <StatBadge icon={<Banknote className="w-4 h-4 text-emerald-400" />} label="Budget" value={`$${budget}M`} />
          <StatBadge icon={<Users className="w-4 h-4 text-amber-400" />} label="Pol. Capital" value={`${politicalCapital}/100`} />
          <StatBadge icon={<Activity className="w-4 h-4 text-blue-400" />} label="Stability" value={`${stability}%`} />
        </div>
      </header>

      <div className="flex-1 flex relative">
        
        {/* Left Sidebar - Demographics */}
        <aside className="w-72 bg-slate-800/80 border-r border-slate-700 p-6 flex flex-col gap-6 backdrop-blur-sm z-10 shadow-xl">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Labor Demographics</h2>
            <div className="space-y-4">
              <SectorBar label="Primary (Agri/Mining)" value={sectors.primary} color="bg-emerald-500" />
              <SectorBar label="Secondary (Industry)" value={sectors.secondary} color="bg-orange-500" />
              <SectorBar label="Tertiary (Tech/Services)" value={sectors.tertiary} color="bg-blue-500" />
            </div>
          </div>
        </aside>

        {/* Center 3D Map Area */}
        <main className="flex-1 relative bg-slate-950">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            {/* Placeholder for the low-poly city */}
            <mesh rotation={[0.5, 0.5, 0]}>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="#3b82f6" wireframe={true} />
            </mesh>
            <OrbitControls autoRotate autoRotateSpeed={1} />
          </Canvas>

          {/* Bottom Action Button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/50 flex items-center gap-2 border border-blue-400/30 transition-colors"
            >
              Review Next Brief <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </main>
      </div>

      {/* Decision Modal (Framer Motion) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-slate-800 border border-slate-600 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-xl font-bold text-red-400">CRISIS: Border Tariff Dispute</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-slate-300">Neighboring countries are taxing your agricultural exports heavily. How do you respond?</p>
                <div className="space-y-3 pt-4">
                  <DecisionButton 
                    text="Subsidize Farmers (Cost: $100M, Capital: +10)" 
                    onClick={() => handleDecision(100, 10)} 
                  />
                  <DecisionButton 
                    text="Retaliate with Tech Tariffs (Cost: $0, Capital: -15)" 
                    onClick={() => handleDecision(0, -15)} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable UI Components
function StatBadge({ icon, label, value }: { icon: ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
      {icon}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">{label}</span>
        <span className="text-sm font-semibold text-white leading-tight">{value}</span>
      </div>
    </div>
  );
}

function SectorBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-300 mb-1">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${value}%` }} 
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}

function DecisionButton({ text, onClick }: { text: string, onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-xl border border-slate-600 transition-colors font-medium text-slate-100 shadow-sm"
    >
      {text}
    </motion.button>
  );
}
