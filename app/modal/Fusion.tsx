import React, { useState } from 'react';
import { useGameStore } from '../../src/store/gameStore';

export const Fusion: React.FC = () => {
  const { creatures, handleFusion, inventory, setGameState } = useGameStore();
  const [fusionSelection, setFusionSelection] = useState<{ slotA: string | null, slotB: string | null }>({ slotA: null, slotB: null });
  const [isFusing, setIsFusing] = useState(false);

  const performFusion = async () => {
    if (!fusionSelection.slotA || !fusionSelection.slotB) return;
    setIsFusing(true);
    await handleFusion(fusionSelection.slotA, fusionSelection.slotB);
    setIsFusing(false);
  };

  const { slotA, slotB } = fusionSelection;
  const creatureA = creatures.find(c => c.id === slotA);
  const creatureB = creatures.find(c => c.id === slotB);
  const hasCatalyst = inventory['fusion_core'] > 0;
  const canFuse = slotA && slotB && slotA !== slotB;

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col p-4">
      <div className="flex justify-between items-center border-b border-purple-800 pb-2 mb-4">
        <h2 className="text-purple-400 text-lg font-bold tracking-widest">DNA FUSION CHAMBER</h2>
        <button 
          onClick={() => setGameState({ activeTab: 'HOME' })}
          className="text-xs text-purple-600 hover:text-purple-300"
        >
          [CLOSE]
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
            { slot: 'slotA', creature: creatureA, label: 'Primary Subject' },
            { slot: 'slotB', creature: creatureB, label: 'Material Subject' }
        ].map(({slot, creature, label}) => (
            <div key={slot} className="border border-purple-500/30 bg-purple-900/10 p-2 rounded min-h-[100px] flex flex-col">
                <span className="text-[10px] text-purple-400 uppercase mb-2">{label}</span>
                {creature ? (
                <div onClick={() => setFusionSelection(p => ({...p, [slot]: null}))} className="cursor-pointer">
                    <div className="text-cyan-200 font-bold">{creature.name}</div>
                    <div className="text-xs text-cyan-600">{creature.stage}</div>
                </div>
                ) : (
                <div className="flex-1 flex items-center justify-center text-purple-700 text-xs italic">Select</div>
                )}
            </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto border-t border-purple-900/50 pt-2 mb-2">
        <div className="text-[10px] text-purple-500 mb-1">AVAILABLE SUBJECTS</div>
        <div className="grid grid-cols-1 gap-1">
            {creatures.map(c => {
            const isSelected = c.id === slotA || c.id === slotB;
            return (
                <button
                key={c.id}
                disabled={isSelected}
                onClick={() => {
                    if (!slotA) setFusionSelection(p => ({...p, slotA: c.id}));
                    else if (!slotB) setFusionSelection(p => ({...p, slotB: c.id}));
                }}
                className={`text-left p-2 rounded text-xs border ${
                    isSelected ? 'opacity-50 border-purple-900' : 'border-slate-700 hover:bg-purple-900/20'
                }`}
                >
                <span className="text-cyan-300">{c.name}</span> <span className="text-slate-500">[{c.stage}]</span>
                </button>
            )
            })}
        </div>
      </div>

      <div className="mt-auto">
        <div className={`text-xs mb-2 flex items-center gap-2 ${hasCatalyst ? 'text-green-400' : 'text-slate-600'}`}>
          <span className="text-xl">⚛️</span> 
          {hasCatalyst ? 'FUSION CORE DETECTED (+Stability)' : 'NO CATALYST (High Risk)'}
        </div>
        
        <button
          disabled={!canFuse || isFusing}
          onClick={performFusion}
          className={`w-full py-3 rounded font-bold tracking-widest transition-all ${
            canFuse 
            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          {isFusing ? 'FUSING...' : 'INITIATE FUSION'}
        </button>
      </div>
    </div>
  );
};