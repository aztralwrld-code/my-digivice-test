import { useState, useEffect } from 'react';
import { 
  GameState, Stage, ActionType, StatType, LogEntry, EvolutionOption 
} from '../types';
import { 
  INITIAL_CREATURE, GAME_ITEMS, INITIAL_INVENTORY, INITIAL_HATCHERY_SLOTS 
} from '../constants';
import { 
  generateCreatureResponse, generateEvolutionOptions, generateExploreEvent 
} from '../services/geminiService';
import { processTick } from '../src/engine/tick';

export function useGameStore() {
  const [gameState, setGameState] = useState<GameState>({
    creatures: [{...INITIAL_CREATURE, id: crypto.randomUUID()}],
    activeCreatureId: '', 
    hatcherySlots: INITIAL_HATCHERY_SLOTS,
    logs: [{ 
      id: 'init', 
      text: 'AETHER LINK v0.9 ONLINE', 
      type: 'system', 
      timestamp: Date.now() 
    }],
    isThinking: false,
    inventory: INITIAL_INVENTORY,
    digidex: [],
    activeTab: 'HOME',
    lastTickAt: Date.now()
  });

  const [evolutionPaths, setEvolutionPaths] = useState<EvolutionOption[] | null>(null);

  // Initialize active creature
  useEffect(() => {
    if (gameState.creatures.length > 0 && !gameState.activeCreatureId) {
      setGameState(prev => ({ ...prev, activeCreatureId: prev.creatures[0].id }));
    }
  }, [gameState.creatures]);

  // --- TIME ENGINE ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      setGameState(prev => {
        const update = processTick(prev);
        return update ? { ...prev, ...update } : prev;
      });
    }, 10000); // 10 seconds

    // Initial tick to catch up
    setGameState(prev => {
        const update = processTick(prev);
        return update ? { ...prev, ...update } : prev;
    });

    return () => clearInterval(intervalId);
  }, []);

  const addLog = (text: string, type: LogEntry['type'] = 'system') => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, { id: Math.random().toString(36).substr(2, 9), text, type, timestamp: Date.now() }]
    }));
  };

  const handleStatUpdate = (creatureId: string, changes: Partial<Record<StatType, number>>) => {
    setGameState(prev => {
      const updatedCreatures = prev.creatures.map(c => {
        if (c.id !== creatureId) return c;
        const newStats = { ...c.stats };
        (Object.keys(changes) as StatType[]).forEach(stat => {
          if (changes[stat]) {
            newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + (changes[stat] || 0)));
          }
        });
        return { ...c, stats: newStats };
      });
      return { ...prev, creatures: updatedCreatures };
    });
  };

  const activeCreature = gameState.creatures.find(c => c.id === gameState.activeCreatureId);

  const handleAction = async (action: ActionType, context?: string) => {
    if (gameState.isThinking || !activeCreature) return;
    setGameState(prev => ({ ...prev, isThinking: true }));

    const impacts: Partial<Record<StatType, number>> = {};
    let logMsg = '';

    switch (action) {
      case 'CONNECT': impacts[StatType.BOND] = 10; impacts[StatType.ENERGY] = 5; logMsg = 'Warmth transferred.'; break;
      case 'BOND': impacts[StatType.BOND] = 8; impacts[StatType.STABILITY] = 5; logMsg = 'Resonance stabilized.'; break;
      case 'FEED': impacts[StatType.ENERGY] = 25; logMsg = 'Nutrients absorbed.'; break;
      case 'TRAIN': impacts[StatType.POWER] = 5; impacts[StatType.ENERGY] = -15; logMsg = 'Training complete.'; break;
      case 'TALK': impacts[StatType.BOND] = 5; impacts[StatType.CURIOSITY] = 5; logMsg = 'Data shared.'; break;
      case 'EXPLORE': impacts[StatType.CURIOSITY] = 10; impacts[StatType.ENERGY] = -20; break;
      case 'REST': impacts[StatType.ENERGY] = 50; impacts[StatType.STABILITY] = 5; logMsg = 'System sleeping...'; break;
      case 'DISCIPLINE': impacts[StatType.STABILITY] = 10; impacts[StatType.BOND] = -5; logMsg = 'Protocols enforced.'; break;
    }

    if (action === 'EXPLORE') {
      const event = await generateExploreEvent(activeCreature);
      logMsg = event.text;
      if (Math.random() > 0.7) {
        const itemKeys = Object.keys(GAME_ITEMS);
        const randomItemKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        const item = GAME_ITEMS[randomItemKey];
        setGameState(prev => ({
          ...prev,
          inventory: { ...prev.inventory, [randomItemKey]: (prev.inventory[randomItemKey] || 0) + 1 },
          logs: [...prev.logs, { id: Date.now()+'item', text: `DOWNLOADED: ${item.name}`, type: 'item', timestamp: Date.now() }]
        }));
      }
    }

    const response = await generateCreatureResponse(activeCreature, action, context || logMsg);
    handleStatUpdate(activeCreature.id, impacts);
    addLog(`> ${logMsg}`, 'system');
    setGameState(prev => ({
      ...prev,
      isThinking: false,
      logs: [...prev.logs, { id: Date.now() + 'res', text: `"${response}"`, type: 'creature', timestamp: Date.now() }]
    }));
  };

  const handleUseItem = async (itemId: string) => {
    if (gameState.isThinking || !activeCreature) return;
    const item = GAME_ITEMS[itemId];
    if (!item || (gameState.inventory[itemId] || 0) <= 0) return;

    setGameState(prev => ({ ...prev, isThinking: true, inventory: { ...prev.inventory, [itemId]: prev.inventory[itemId] - 1 } }));
    handleStatUpdate(activeCreature.id, item.effects);
    const response = await generateCreatureResponse(activeCreature, 'USE_ITEM', `Used ${item.name}`);
    
    setGameState(prev => ({
      ...prev, isThinking: false,
      logs: [...prev.logs, { id: Date.now()+'use', text: `USED: ${item.name}`, type: 'item', timestamp: Date.now() },
        { id: Date.now()+'res', text: `"${response}"`, type: 'creature', timestamp: Date.now() }]
    }));
  };

  const handleEvolve = async () => {
    if (!activeCreature?.evolutionReady) return;
    setGameState(prev => ({ ...prev, isThinking: true }));
    let nextStage = Stage.BABY;
    if (activeCreature.stage === Stage.EGG) nextStage = Stage.BABY;
    else if (activeCreature.stage === Stage.BABY) nextStage = Stage.ROOKIE;
    else if (activeCreature.stage === Stage.ROOKIE) nextStage = Stage.CHAMPION;
    else if (activeCreature.stage === Stage.CHAMPION) nextStage = Stage.ULTIMATE;

    const options = await generateEvolutionOptions(activeCreature.stage, nextStage, activeCreature.stats, activeCreature.traits);
    setEvolutionPaths(options);
    setGameState(prev => ({ ...prev, isThinking: false }));
  };

  const finalizeEvolution = (selectedPath: EvolutionOption) => {
    if (!activeCreature) return;
    setGameState(prev => {
       let nextStage = Stage.BABY;
        if (activeCreature.stage === Stage.EGG) nextStage = Stage.BABY;
        else if (activeCreature.stage === Stage.BABY) nextStage = Stage.ROOKIE;
        else if (activeCreature.stage === Stage.ROOKIE) nextStage = Stage.CHAMPION;
        else if (activeCreature.stage === Stage.CHAMPION) nextStage = Stage.ULTIMATE;

      const updatedCreatures = prev.creatures.map(c => {
        if (c.id !== activeCreature.id) return c;
        return { ...c, stage: nextStage, name: selectedPath.name, formDescription: selectedPath.description, traits: [...c.traits, ...selectedPath.traits], color: selectedPath.color || c.color, evolutionReady: false };
      });
      return { ...prev, creatures: updatedCreatures, logs: [...prev.logs, { id: Date.now()+'evo', text: `EVOLUTION COMPLETE!`, type: 'evolution', timestamp: Date.now() }] };
    });
    setEvolutionPaths(null);
  };

  return {
    gameState,
    setGameState,
    activeCreature,
    evolutionPaths,
    handleAction,
    handleUseItem,
    handleEvolve,
    finalizeEvolution,
    setEvolutionPaths,
    addLog
  };
}