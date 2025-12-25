import React from 'react';
import { ItemDefinition } from '../../types';

interface ItemRowProps {
  item: ItemDefinition;
  count: number;
  onUse: () => void;
  disabled?: boolean;
}

export const ItemRow: React.FC<ItemRowProps> = ({ item, count, onUse, disabled }) => {
  if (count <= 0) return null;
  
  return (
    <button 
      onClick={onUse}
      disabled={disabled}
      className="flex items-center gap-3 p-2 bg-cyan-900/20 border border-cyan-500/30 rounded hover:bg-cyan-800/40 transition-colors text-left w-full"
    >
      <div className="text-2xl">{item.icon}</div>
      <div className="flex-1">
        <div className="text-sm text-cyan-200 font-bold">{item.name}</div>
        <div className="text-[10px] text-cyan-500">{item.description}</div>
      </div>
      <div className="text-sm font-mono text-cyan-400">x{count}</div>
    </button>
  );
};