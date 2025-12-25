import React from 'react';
import { useGameStore } from '../../src/store/gameStore';

export const Interact: React.FC = () => {
  const { handleAction } = useGameStore();

  return (
    <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
      <button onClick={() => handleAction('TALK')} className="p-4 bg-blue-900/20 border border-blue-500/30 rounded flex flex-col items-center hover:bg-blue-900/40 transition-colors">
        <span className="text-2xl mb-1">💬</span>
        <span className="text-xs font-bold text-blue-300 tracking-widest">SPEAK</span>
      </button>
      <button onClick={() => handleAction('DISCIPLINE')} className="p-4 bg-purple-900/20 border border-purple-500/30 rounded flex flex-col items-center hover:bg-purple-900/40 transition-colors">
        <span className="text-2xl mb-1">⚠️</span>
        <span className="text-xs font-bold text-purple-300 tracking-widest">WARN</span>
      </button>
      <button onClick={() => handleAction('CONNECT')} className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded flex flex-col items-center hover:bg-cyan-900/40 transition-colors">
        <span className="text-2xl mb-1">📡</span>
        <span className="text-xs font-bold text-cyan-300 tracking-widest">SYNC</span>
      </button>
      <button onClick={() => handleAction('BOND')} className="p-4 bg-pink-900/20 border border-pink-500/30 rounded flex flex-col items-center hover:bg-pink-900/40 transition-colors">
        <span className="text-2xl mb-1">💗</span>
        <span className="text-xs font-bold text-pink-300 tracking-widest">SOOTHE</span>
      </button>
      <button onClick={() => handleAction('TRAIN')} className="p-4 bg-red-900/20 border border-red-500/30 rounded flex flex-col items-center hover:bg-red-900/40 transition-colors">
        <span className="text-2xl mb-1">⚔️</span>
        <span className="text-xs font-bold text-red-300 tracking-widest">TRAIN</span>
      </button>
      <button onClick={() => handleAction('EXPLORE')} className="p-4 bg-green-900/20 border border-green-500/30 rounded flex flex-col items-center hover:bg-green-900/40 transition-colors">
        <span className="text-2xl mb-1">🕸️</span>
        <span className="text-xs font-bold text-green-300 tracking-widest">EXPLORE</span>
      </button>
    </div>
  );
};