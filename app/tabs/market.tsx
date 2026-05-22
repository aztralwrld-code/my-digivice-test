import React from 'react';
import { useGameStore } from '../../src/store/gameStore';
import { GAME_ITEMS, SHOP_ITEMS, MAX_HATCHERY_SLOTS } from '../../constants';

export const Market: React.FC = () => {
  const { credits, hatcherySlots, handlePurchase } = useGameStore();

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-cyan-800 pb-1 mb-2">
        <h2 className="text-cyan-400 text-lg font-bold tracking-widest">MARKET</h2>
        <div className="text-xs text-cyan-600">CREDITS: {credits}</div>
      </div>
      <div className="space-y-3 overflow-y-auto pr-1">
        {SHOP_ITEMS.map((item) => {
          const linkedItem = item.itemId ? GAME_ITEMS[item.itemId] : null;
          const isUpgradeLocked = item.upgrade === 'HATCHERY_SLOT' && hatcherySlots >= MAX_HATCHERY_SLOTS;
          const canAfford = credits >= item.cost;
          const disabled = !canAfford || isUpgradeLocked;

          return (
            <div key={item.id} className="bg-slate-900/80 border border-cyan-900/50 p-3 rounded flex items-center justify-between gap-4">
              <div>
                <div className="text-cyan-300 font-bold uppercase text-sm flex items-center gap-2">
                  {linkedItem?.icon && <span>{linkedItem.icon}</span>}
                  {item.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">{item.description}</div>
                {item.upgrade === 'HATCHERY_SLOT' && (
                  <div className="text-[10px] text-cyan-600 mt-1">
                    Hatchery Slots: {hatcherySlots}/{MAX_HATCHERY_SLOTS}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-[10px] text-cyan-500 uppercase">Cost {item.cost}</div>
                <button
                  onClick={() => handlePurchase(item.id)}
                  disabled={disabled}
                  className={`px-3 py-1 rounded border text-[10px] font-bold transition-all ${
                    disabled
                      ? 'border-slate-700 text-slate-600 cursor-not-allowed'
                      : 'border-cyan-400 text-cyan-200 hover:bg-cyan-500/20'
                  }`}
                >
                  {isUpgradeLocked ? 'MAXED' : canAfford ? 'BUY' : 'INSUFFICIENT'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
