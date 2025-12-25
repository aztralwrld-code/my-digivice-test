import React from 'react';
import { useGameStore } from '../../src/store/gameStore';

export const Digidex: React.FC = () => {
  const { digidex } = useGameStore();

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <h2 className="text-cyan-400 text-lg border-b border-cyan-800 pb-1 mb-2 font-bold tracking-widest">
        DATABASE
      </h2>
      <div className="space-y-2 overflow-y-auto pr-1">
        {digidex.map((entry, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-cyan-900/50 p-3 rounded">
            <div className="flex justify-between items-start mb-1">
              <span className="text-cyan-300 font-bold uppercase">{entry.name}</span>
              <span className="text-[10px] text-cyan-600 border border-cyan-900 px-1 rounded">{entry.stage}</span>
            </div>
            <div className="text-[10px] text-cyan-500 uppercase tracking-wider mb-2">{entry.type}</div>
            <div className="text-xs text-slate-400 italic">"{entry.description}"</div>
          </div>
        ))}
        {digidex.length === 0 && (
          <div className="text-center text-slate-500 py-10">DATABASE EMPTY</div>
        )}
      </div>
    </div>
  );
};