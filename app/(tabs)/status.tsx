import React from 'react';
import { useGameStore } from '../../src/store/gameStore';
import { StatBar } from '../../src/ui/StatBar';

export const Status: React.FC = () => {
  const { creatures, activeCreatureId } = useGameStore();
  const creature = creatures.find(c => c.id === activeCreatureId);

  if (!creature) return null;

  return (
    <div className="space-y-3 animate-in fade-in duration-300">
      <h2 className="text-cyan-400 text-lg border-b border-cyan-800 pb-1 mb-2 font-bold tracking-widest">
        SYSTEM STATUS: {creature.name.toUpperCase()}
      </h2>
      
      <StatBar label="ENERGY" value={creature.stats.Energy} color="cyan" />
      <StatBar label="BOND" value={creature.stats.Bond} color="cyan" />
      <StatBar label="STABILITY" value={creature.stats.Stability} color="cyan" />
      <StatBar label="POWER" value={creature.stats.Power} color="cyan" />
      <StatBar label="CURIOSITY" value={creature.stats.Curiosity} color="cyan" />

      {creature.isFused && (
        <div className="mt-4 p-2 bg-purple-900/20 rounded border border-purple-500/30">
          <StatBar label="FUSION INSTABILITY" value={creature.instability || 0} color="purple" />
          <div className="mt-2 text-[10px] text-purple-400 font-mono">
            TRAIT: {creature.fusionTrait}
          </div>
        </div>
      )}

      <div className="mt-4 p-2 bg-slate-900/50 rounded border border-slate-700">
        <div className="text-[10px] text-slate-400 uppercase">Traits</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {creature.traits.map((t, i) => (
            <span key={i} className="text-[10px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};