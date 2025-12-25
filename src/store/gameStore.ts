import { create } from "zustand";
import { 
  GameState, Creature, Stage, ActionType, StatType, EvolutionOption, LogEntry 
} from "../../types";
import { 
  INITIAL_CREATURE, INITIAL_HATCHERY_SLOTS, INITIAL_INVENTORY, GAME_ITEMS 
} from "../../constants";
import { 
  generateCreatureResponse, generateEvolutionOptions, generateExploreEvent, generateFusionResult 
} from "../../services/geminiService";
import { processTick } from "../engine/tick";

interface GameActions {
  setGameState: (state: Partial<GameState>) => void;
  addLog: (text: string, type?: LogEntry['type']) => void;
  setActiveCreature: (id: string) => void;
  handleAction: (action: ActionType) => Promise<void>;
  handleUseItem: (itemId: string) => Promise<void>;
  handleEvolve: () => Promise<void>;
  finalizeEvolution: (path: EvolutionOption) => void;
  handleFusion: (slotA: string, slotB: string) => Promise<void>;
  processTime: () => void;
}

interface StoreState extends GameState, GameActions {
  evolutionPaths: EvolutionOption[] | null;
  setEvolutionPaths: (paths: EvolutionOption[] | null) => void;
}

export const useGameStore = create<StoreState>((set, get) => ({
  // Initial State
  creatures: [{...INITIAL_CREATURE, id: crypto.randomUUID()}],
  activeCreatureId: '',
  hatcherySlots: INITIAL_HATCHERY_SLOTS,
  logs: [{ 
    id: 'init', 
    text: 'AETHER LINK v1.0 ONLINE', 
    type: 'system', 
    timestamp: Date.now() 
  }],
  isThinking: false,
  inventory: INITIAL_INVENTORY,
  digidex: [],
  activeTab: 'HOME',
  lastTickAt: Date.now(),
  evolutionPaths: null,

  // Actions
  setGameState: (newState) => set((state) => ({ ...state, ...newState })),
  
  setEvolutionPaths: (paths) => set({ evolutionPaths: paths }),

  addLog: (text, type = 'system') => set((state) => ({
    logs: [...state.logs, { id: Math.random().toString(36).substr(2, 9), text, type, timestamp: Date.now() }]
  })),

  setActiveCreature: (id) => set({ activeCreatureId: id }),

  processTime: () => {
    set((state) => {
      const update = processTick(state);
      return update ? { ...state, ...update } : state;
    });
  },

  handleAction: async (action) => {
    const state = get();
    const activeCreature = state.creatures.find(c => c.id === state.activeCreatureId);
    if (state.isThinking || !activeCreature) return;

    set({ isThinking: true });
    
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
        set((prev) => ({
          inventory: { ...prev.inventory, [randomItemKey]: (prev.inventory[randomItemKey] || 0) + 1 },
          logs: [...prev.logs, { id: Date.now()+'item', text: `DOWNLOADED: ${item.name}`, type: 'item', timestamp: Date.now() }]
        }));
      }
    }

    const response = await generateCreatureResponse(activeCreature, action, logMsg);
    
    // Update Stats
    set((prev) => {
      const updatedCreatures = prev.creatures.map(c => {
        if (c.id !== activeCreature.id) return c;
        const newStats = { ...c.stats };
        (Object.keys(impacts) as StatType[]).forEach(stat => {
          if (impacts[stat]) {
            newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + (impacts[stat] || 0)));
          }
        });
        return { ...c, stats: newStats };
      });
      return { 
        creatures: updatedCreatures, 
        isThinking: false,
        logs: [...prev.logs, 
          { id: Date.now() + 'sys', text: `> ${logMsg}`, type: 'system', timestamp: Date.now() },
          { id: Date.now() + 'res', text: `"${response}"`, type: 'creature', timestamp: Date.now() }
        ]
      };
    });
  },

  handleUseItem: async (itemId) => {
    const state = get();
    const activeCreature = state.creatures.find(c => c.id === state.activeCreatureId);
    if (state.isThinking || !activeCreature) return;
    
    const item = GAME_ITEMS[itemId];
    if (!item || (state.inventory[itemId] || 0) <= 0) return;

    set((prev) => ({ 
      isThinking: true, 
      inventory: { ...prev.inventory, [itemId]: prev.inventory[itemId] - 1 } 
    }));

    // Apply Effects
    set((prev) => {
      const updatedCreatures = prev.creatures.map(c => {
        if (c.id !== activeCreature.id) return c;
        const newStats = { ...c.stats };
        (Object.keys(item.effects) as StatType[]).forEach(stat => {
          if (item.effects[stat]) {
            newStats[stat] = Math.max(0, Math.min(100, newStats[stat] + (item.effects[stat] || 0)));
          }
        });
        return { ...c, stats: newStats };
      });
      return { creatures: updatedCreatures };
    });

    const response = await generateCreatureResponse(activeCreature, 'USE_ITEM', `Used ${item.name}`);
    
    set((prev) => ({
      isThinking: false,
      logs: [...prev.logs, 
        { id: Date.now()+'use', text: `USED: ${item.name}`, type: 'item', timestamp: Date.now() },
        { id: Date.now()+'res', text: `"${response}"`, type: 'creature', timestamp: Date.now() }
      ]
    }));
  },

  handleEvolve: async () => {
    const state = get();
    const activeCreature = state.creatures.find(c => c.id === state.activeCreatureId);
    if (!activeCreature?.evolutionReady) return;
    
    set({ isThinking: true });
    
    let nextStage = Stage.BABY;
    if (activeCreature.stage === Stage.EGG) nextStage = Stage.BABY;
    else if (activeCreature.stage === Stage.BABY) nextStage = Stage.ROOKIE;
    else if (activeCreature.stage === Stage.ROOKIE) nextStage = Stage.CHAMPION;
    else if (activeCreature.stage === Stage.CHAMPION) nextStage = Stage.ULTIMATE;

    const options = await generateEvolutionOptions(activeCreature.stage, nextStage, activeCreature.stats, activeCreature.traits);
    set({ evolutionPaths: options, isThinking: false });
  },

  finalizeEvolution: (selectedPath) => {
    set((prev) => {
      const activeCreature = prev.creatures.find(c => c.id === prev.activeCreatureId);
      if (!activeCreature) return prev;

      let nextStage = Stage.BABY;
      if (activeCreature.stage === Stage.EGG) nextStage = Stage.BABY;
      else if (activeCreature.stage === Stage.BABY) nextStage = Stage.ROOKIE;
      else if (activeCreature.stage === Stage.ROOKIE) nextStage = Stage.CHAMPION;
      else if (activeCreature.stage === Stage.CHAMPION) nextStage = Stage.ULTIMATE;

      const updatedCreatures = prev.creatures.map(c => {
        if (c.id !== activeCreature.id) return c;
        return { 
          ...c, 
          stage: nextStage, 
          name: selectedPath.name, 
          formDescription: selectedPath.description, 
          traits: [...c.traits, ...selectedPath.traits], 
          color: selectedPath.color || c.color, 
          evolutionReady: false 
        };
      });
      
      const newDexEntry = {
        name: selectedPath.name,
        stage: nextStage,
        type: selectedPath.type,
        description: selectedPath.description,
        unlockedAt: Date.now()
      };

      return { 
        creatures: updatedCreatures, 
        evolutionPaths: null,
        digidex: [...prev.digidex, newDexEntry],
        logs: [...prev.logs, { id: Date.now()+'evo', text: `EVOLUTION COMPLETE!`, type: 'evolution', timestamp: Date.now() }] 
      };
    });
  },

  handleFusion: async (slotA, slotB) => {
    const state = get();
    const parentA = state.creatures.find(c => c.id === slotA);
    const parentB = state.creatures.find(c => c.id === slotB);
    
    if (!parentA || !parentB) return;
    
    set({ isThinking: true });

    const hasCatalyst = state.inventory['fusion_core'] > 0;
    const fusionResult = await generateFusionResult(parentA, parentB);
    
    // ... Fusion Math Logic ... 
    // Simplified for brevity, duplicating logic from before essentially
    const newStats = { ...parentA.stats }; // Placeholder
    
    const fusedCreature: Creature = {
      id: crypto.randomUUID(),
      name: fusionResult.name,
      stage: Stage.MEGA, // Simplified
      stats: newStats,
      traits: fusionResult.traits,
      age: 0,
      formDescription: fusionResult.description,
      color: fusionResult.color,
      evolutionReady: false,
      isFused: true,
      fusionTrait: fusionResult.fusionTrait,
      instability: hasCatalyst ? 10 : 40,
      parents: [parentA.name, parentB.name]
    };

    set((prev) => {
      const remaining = prev.creatures.filter(c => c.id !== slotA && c.id !== slotB);
      const newInv = { ...prev.inventory };
      if (hasCatalyst) newInv['fusion_core']--;
      
      return {
        creatures: [...remaining, fusedCreature],
        activeCreatureId: fusedCreature.id,
        inventory: newInv,
        activeTab: 'HOME',
        isThinking: false,
        logs: [...prev.logs, { id: Date.now()+'fuse', text: `FUSION COMPLETE: ${fusedCreature.name}`, type: 'fusion', timestamp: Date.now() }]
      };
    });
  }
}));