import React from 'react';
import { GameState } from '../../types';
import { INITIAL_CREATURE } from '../../constants';
import { CreatureCard } from '../../src/ui/CreatureCard';

interface HatcheryProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const Hatchery: React.FC<HatcheryProps> = ({ gameState, setGameState }) => {
  const createNewEgg = () => {
     if (gameState.creatures.length >= gameState.hatcherySlots) return;
     const newId = crypto.randomUUID();
     const newEgg = { ...INITIAL_CREATURE, id: newId };
     setGameState(prev => ({
       ...prev,
       creatures: [...prev.creatures, newEgg],
       activeCreatureId: newId,
       logs: [...prev.logs, { id: Date.now() + 'hatch', text: 'NEW EGG GENERATED IN HATCHERY.', type: 'system', timestamp: Date.now() }]
     }));
  };

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex justify-between items-end border-b border-cyan-800 pb-1 mb-4">
        <h2 className="text-cyan-400 text-lg font-bold tracking-widest">HATCHERY</h2>
        <div className="text-xs text-cyan-600">SLOTS {gameState.creatures.length}/{gameState.hatcherySlots}</div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1">
        {gameState.creatures.map((creature) => (
          <CreatureCard 
            key={creature.id}
            creature={creature}
            isActive={gameState.activeCreatureId === creature.id}
            onClick={() => setGameState(prev => ({ ...prev, activeCreatureId: creature.id }))}
          />
        ))}

        {gameState.creatures.length < gameState.hatcherySlots && (
           <button 
             onClick={createNewEgg}
             className="p-4 rounded border border-dashed border-cyan-700/50 text-cyan-600 hover:bg-cyan-900/20 hover:text-cyan-400 hover:border-cyan-500 transition-all flex flex-col items-center justify-center gap-2"
           >
              <span className="text-2xl">+</span>
              <span className="text-xs tracking-widest">INITIATE NEW EGG</span>
           </button>
        )}
      </div>
    </div>
  );
};