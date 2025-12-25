import React, { ReactNode } from 'react';

interface DigiviceProps {
  children: ReactNode;
  className?: string;
}

export const Digivice: React.FC<DigiviceProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative bg-slate-800 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(34,211,238,0.2)] border-4 border-slate-700 max-w-md w-full mx-auto ${className}`}>
      {/* Device Hardware Details */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-900 rounded-full"></div>
      <div className="absolute top-6 left-6 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
      
      {/* Screen Container */}
      <div className="bg-slate-900 rounded-2xl p-1 shadow-inner border border-slate-600 overflow-hidden relative">
        <div className="scanlines absolute inset-0 pointer-events-none z-10 opacity-30"></div>
        <div className="bg-[#0f172a] min-h-[400px] relative z-0 p-4 font-vt323 text-cyan-400 text-lg">
          {children}
        </div>
      </div>

      {/* Branding */}
      <div className="text-center mt-4 text-slate-500 text-xs font-bold tracking-[0.3em] uppercase">
        Aether Link v0.9
      </div>
    </div>
  );
};
