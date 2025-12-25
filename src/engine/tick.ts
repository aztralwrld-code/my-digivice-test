import { GameState, StatType, Stage } from '../../types';
import { STAGE_THRESHOLDS } from '../../constants';

export const processTick = (prevState: GameState): Partial<GameState> | null => {
  const now = Date.now();
  const deltaMs = now - prevState.lastTickAt;
  
  // Prevent processing if delta is too small (e.g., < 1 sec)
  if (deltaMs < 1000) return null;

  const deltaMinutes = deltaMs / 60000;
  let significantEvent = '';

  const updatedCreatures = prevState.creatures.map(c => {
    const isActive = c.id === prevState.activeCreatureId;
    const timeRate = isActive ? 1.0 : 0.35;
    const effectiveMinutes = deltaMinutes * timeRate;

    // Decay Rates
    let decayEnergy = 0.2 * effectiveMinutes;
    let decayBond = 0.05 * effectiveMinutes;

    if (c.isFused && (c.instability || 0) > 50) {
       decayBond *= 2; 
       decayEnergy *= 1.2;
    }

    let newEnergy = Math.max(0, c.stats.Energy - decayEnergy);
    let newBond = Math.max(0, c.stats.Bond - decayBond);
    const newAge = c.age + effectiveMinutes;

    // Threshold Checks
    if (isActive) {
      if (c.stats.Energy > 20 && newEnergy <= 20) {
        significantEvent = 'WARNING: LOW ENERGY RESERVES';
      }
    }

    // Evolution Check
    let nextEvolutionReady = c.evolutionReady;
    const threshold = STAGE_THRESHOLDS[c.stage];
    if (!c.evolutionReady && threshold && newAge >= threshold) {
      nextEvolutionReady = true;
      if (isActive && !significantEvent) significantEvent = 'EVOLUTION SIGNAL DETECTED';
    }

    return {
      ...c,
      age: newAge,
      stats: { 
        ...c.stats, 
        [StatType.ENERGY]: newEnergy, 
        [StatType.BOND]: newBond 
      },
      evolutionReady: nextEvolutionReady
    };
  });

  let newLogs = prevState.logs;
  if (significantEvent) {
    newLogs = [...prevState.logs, { 
      id: Date.now().toString(), 
      text: significantEvent, 
      type: 'system', 
      timestamp: Date.now() 
    }];
  }

  return { 
    creatures: updatedCreatures, 
    logs: newLogs, 
    lastTickAt: now 
  };
};