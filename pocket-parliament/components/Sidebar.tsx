'use client';

import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Sidebar() {
  const { sectors } = useGameStore();
  const unemployment = Math.max(0, 100 - sectors.primary - sectors.secondary - sectors.tertiary);

  const data = [
    { name: 'Primary (Agri/Mining)', value: sectors.primary, color: '#f59e0b' },
    { name: 'Secondary (Industry)', value: sectors.secondary, color: '#3b82f6' },
    { name: 'Tertiary (Services/AI)', value: sectors.tertiary, color: '#8b5cf6' },
    { name: 'Unemployed', value: unemployment, color: '#ef4444' },
  ];

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-16 bottom-0 w-80 bg-zinc-950 border-r border-zinc-800 text-white p-6 overflow-y-auto z-30 shadow-2xl"
    >
      <h2 className="text-xl font-bold mb-6 text-zinc-100 border-b border-zinc-800 pb-2">National Demographics</h2>
      
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Labor Force</h3>
        <div className="h-64 w-full bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-zinc-300">{item.name}</span>
            </div>
            <span className="font-mono font-medium">{item.value}%</span>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-rose-400 mb-2">Warning: Economy Fragile</h3>
        <p className="text-xs text-rose-300/80 leading-relaxed">
          High reliance on Primary Sector. Low tertiary sector growth is preventing Soft Power generation.
        </p>
      </div>
    </motion.aside>
  );
}
