import React from 'react';
import { Creature } from '../../types';

interface CreatureCardProps {
  creature: Creature;
  isActive: boolean;
  onClick?: () => void;
}

export const CreatureCard: React.FC<CreatureCardProps> = ({ creature, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-3 rounded border flex items-center gap-4 transition-all cursor-pointer ${
        isActive 
        ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
        : 'bg-slate-900/50 border-slate-700 hover:border-cyan-500/50'
      }`}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-black/40 rounded-full overflow-hidden border border-cyan-900">
         <div className="w-6 h-6 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: creature.color }}></div>
      </div>
      <div className="flex-1">
         <div className="flex justify-between items-center">
            <span className="font-bold text-cyan-200">{creature.name}</span>
            {isActive && <span className="text-[9px] text-green-400 font-mono">[ACTIVE]</span>}
         </div>
         <div className="text-xs text-cyan-600 font-mono uppercase">{creature.stage}</div>
         <div className="w-full h-1 bg-slate-800 rounded mt-1 overflow-hidden">
           <div className="h-full bg-cyan-600" style={{ width: `${creature.stats.Energy}%` }}></div>
         </div>
      </div>
    </div>
  );
};