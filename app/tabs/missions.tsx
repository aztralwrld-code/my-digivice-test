import React from 'react';
import { useGameStore } from '../../src/store/gameStore';
import { GAME_ITEMS } from '../../constants';

export const Missions: React.FC = () => {
  const { missions, claimMissionReward } = useGameStore();

  return (
    <div className="animate-in fade-in duration-300 h-full flex flex-col">
      <h2 className="text-cyan-400 text-lg border-b border-cyan-800 pb-1 mb-2 font-bold tracking-widest">
        MISSION BOARD
      </h2>
      <div className="space-y-3 overflow-y-auto pr-1">
        {missions.map((mission) => {
          const progress = Math.min(100, Math.round((mission.progress / mission.target) * 100));
          const rewardItem = mission.rewardItemId ? GAME_ITEMS[mission.rewardItemId] : null;

          return (
            <div key={mission.id} className="bg-slate-900/80 border border-cyan-900/50 p-3 rounded">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-cyan-300 font-bold uppercase text-sm">{mission.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{mission.description}</div>
                </div>
                <div className="text-[10px] text-cyan-600 border border-cyan-900 px-2 py-0.5 rounded">
                  {mission.progress}/{mission.target}
                </div>
              </div>

              <div className="mt-3">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest">
                <div className="text-cyan-500">
                  Reward: {mission.rewardCredits} credits
                  {rewardItem && <span className="ml-2 text-yellow-400">+ {rewardItem.name}</span>}
                </div>
                <button
                  onClick={() => claimMissionReward(mission.id)}
                  disabled={!mission.completed || mission.claimed}
                  className={`px-3 py-1 rounded border text-[10px] font-bold transition-all ${
                    mission.claimed
                      ? 'border-slate-700 text-slate-600 cursor-default'
                      : mission.completed
                      ? 'border-cyan-400 text-cyan-200 hover:bg-cyan-500/20'
                      : 'border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {mission.claimed ? 'CLAIMED' : mission.completed ? 'CLAIM' : 'IN PROGRESS'}
                </button>
              </div>
            </div>
          );
        })}
        {missions.length === 0 && (
          <div className="text-center text-slate-500 py-10">NO ACTIVE MISSIONS</div>
        )}
      </div>
    </div>
  );
};
