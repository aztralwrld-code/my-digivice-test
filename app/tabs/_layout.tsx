import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../../src/store/gameStore';
import { Digivice } from '../../components/Digivice';
import { TabView, Stage } from '../../types';
import { CreatureDisplay } from '../../components/CreatureDisplay';

// Screens
import { Status } from './status';
import { Feed } from './feed';
import { Interact } from './interact';
import { Hatchery } from './hatchery';
import { Digidex } from './digidex';

export default function TabsLayout() {
  const { 
    activeTab, 
    setGameState, 
    activeCreatureId, 
    creatures, 
    logs,
    evolutionPaths,
    finalizeEvolution,
    handleEvolve,
    handleAction,
    isThinking
  } = useGameStore();

  const activeCreature = creatures.find(c => c.id === activeCreatureId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'STATUS': return activeCreature ? <Status /> : null;
      case 'INVENTORY': return <Feed />;
      case 'ACTIONS': return <Interact />;
      case 'HATCHERY': return <Hatchery />;
      case 'DIGIDEX': return <Digidex />;
      case 'HOME':
      default:
        if (!activeCreature) return null;
        return (
          <div className="flex-1 flex flex-col items-center justify-center transition-all">
             {activeCreature.evolutionReady ? (
               <button onClick={handleEvolve} className="animate-pulse bg-cyan-500 text-black px-6 py-3 rounded font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                 EVOLUTION SIGNAL DETECTED
               </button>
             ) : (
               <div className="transform scale-110">
                 <CreatureDisplay stage={activeCreature.stage} isThinking={isThinking} color={activeCreature.color} />
               </div>
             )}
             <div className="mt-8 text-center">
               <h1 className="text-4xl font-bold text-cyan-200 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                 {activeCreature.name}
               </h1>
               <div className="text-cyan-600 text-xs tracking-[0.5em] mt-1">
                 {activeCreature.stage} {activeCreature.isFused && <span className="text-purple-400 ml-2">[FUSED]</span>}
               </div>
             </div>
             {activeCreature.stage === Stage.EGG && (
                <button onClick={() => handleAction('CONNECT')} className="mt-6 bg-cyan-900/30 border border-cyan-500/50 text-cyan-300 px-6 py-2 rounded-full hover:bg-cyan-500/20">
                  ESTABLISH LINK
                </button>
             )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000510] p-4 font-vt323">
      <Digivice>
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b-2 border-cyan-900/30 pb-2">
          <div className="text-xs text-cyan-600 tracking-[0.2em] font-bold">
            {activeTab === 'HOME' ? 'AETHER LINK' : activeTab}
          </div>
          <div className="text-[10px] text-cyan-800 font-mono">
             {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[300px] flex flex-col relative">
          
          {/* Evolution Modal Overlay */}
          {evolutionPaths && (
            <div className="absolute inset-0 z-50 flex flex-col gap-2 p-2 bg-black/90 backdrop-blur-md rounded border border-cyan-500/50">
               <div className="text-center text-cyan-300 text-xs font-bold animate-pulse mb-4">POTENTIAL DETECTED</div>
               <div className="flex-1 overflow-y-auto space-y-3">
                 {evolutionPaths.map((path, idx) => (
                    <button key={idx} onClick={() => finalizeEvolution(path)} className="w-full text-left bg-cyan-950/50 border border-cyan-500/30 hover:border-cyan-400 p-3 rounded group">
                      <div className="text-[10px] text-cyan-500 mb-1">{path.type}</div>
                      <div className="text-lg font-bold text-white mb-1">{path.name}</div>
                      <div className="text-xs text-cyan-400/70">{path.description}</div>
                    </button>
                 ))}
               </div>
            </div>
          )}

          {renderScreen()}
        </div>

        {/* Log Viewer */}
        <div ref={scrollRef} className="mt-4 h-16 bg-black/60 rounded p-2 text-xs font-mono overflow-y-auto border border-cyan-900/30">
           {logs.map(log => (
             <div key={log.id} className={`mb-0.5 ${log.type === 'creature' ? 'text-green-400' : log.type === 'item' ? 'text-yellow-400' : log.type === 'evolution' ? 'text-pink-400 font-bold' : log.type === 'fusion' ? 'text-purple-400 font-bold' : 'text-cyan-700'}`}>
               {log.type === 'system' && '> '}{log.text}
             </div>
           ))}
        </div>

        {/* Navigation Dock */}
        <div className="mt-4 grid grid-cols-7 gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-700">
           {[{ id: 'HOME', icon: '⌂', label: 'HOME' }, { id: 'STATUS', icon: '📊', label: 'STAT' }, { id: 'ACTIONS', icon: '⚡', label: 'ACT' }, { id: 'INVENTORY', icon: '🎒', label: 'BAG' }, { id: 'DIGIDEX', icon: '📘', label: 'DEX' }, { id: 'HATCHERY', icon: '🥚', label: 'NEST' }, { id: 'FUSION', icon: '⚛️', label: 'FUSE' }].map((tab) => (
             <button key={tab.id} onClick={() => setGameState({ activeTab: tab.id as TabView })} className={`flex flex-col items-center justify-center p-1 rounded transition-all ${activeTab === tab.id ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'text-cyan-600 hover:bg-cyan-900/30 hover:text-cyan-300'}`}>
               <span className="text-xl leading-none mb-0.5">{tab.icon}</span>
               <span className="text-[9px] font-bold tracking-wider">{tab.label}</span>
             </button>
           ))}
        </div>
      </Digivice>
    </div>
  );
}