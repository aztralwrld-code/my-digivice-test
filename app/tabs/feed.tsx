import React from 'react';
import { useGameStore } from '../../src/store/gameStore';
import { GAME_ITEMS } from '../../constants';
import { ItemRow } from '../../src/ui/ItemRow';

export const Feed: React.FC = () => {
  const { inventory, handleUseItem, isThinking } = useGameStore();

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <h2 className="text-cyan-400 text-lg border-b border-cyan-800 pb-1 mb-2 font-bold tracking-widest">
        STORAGE
      </h2>
      <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1">
        {(Object.entries(inventory) as [string, number][]).map(([id, count]) => {
          if (count <= 0) return null;
          const item = GAME_ITEMS[id];
          if (!item) return null;

          return (
            <ItemRow 
              key={id}
              item={item}
              count={count}
              onUse={() => handleUseItem(id)}
              disabled={isThinking}
            />
          );
        })}
        {(Object.values(inventory) as number[]).every(c => c <= 0) && (
          <div className="text-center text-slate-500 py-10">NO DATA CHIPS FOUND</div>
        )}
      </div>
    </div>
  );
};