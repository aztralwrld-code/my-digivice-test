import React from 'react';
import { StatType } from '../../types';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  max?: number;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, color, max = 100 }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`bg-${color}-900/10 p-2 rounded border border-${color}-900/30`}>
      <div className="flex justify-between items-end mb-1">
        <span className={`text-xs text-${color}-500 uppercase font-bold`}>{label}</span>
        <span className={`text-xs text-${color}-300`}>{Math.round(value)}</span>
      </div>
      <div className={`h-1.5 bg-${color}-950 rounded-full overflow-hidden`}>
        <div 
          className={`h-full bg-${color}-500 transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};