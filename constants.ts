import { Creature, Stage, StatType, ItemDefinition, ItemCategory } from './types';

export const INITIAL_STATS = {
  [StatType.ENERGY]: 50,
  [StatType.BOND]: 10,
  [StatType.CURIOSITY]: 10,
  [StatType.STABILITY]: 50,
  [StatType.POWER]: 10,
};

export const INITIAL_CREATURE: Creature = {
  id: 'starter',
  name: 'Digi-Egg',
  stage: Stage.EGG,
  stats: INITIAL_STATS,
  traits: ['Mysterious'],
  age: 0,
  formDescription: 'A glowing, pulsating egg with digital artifacts floating around it.',
  color: '#22d3ee', // Cyan-400
  evolutionReady: false,
  isFused: false,
  instability: 0
};

export const INITIAL_HATCHERY_SLOTS = 3;

export const STAGE_THRESHOLDS = {
  [Stage.BABY]: 5,
  [Stage.ROOKIE]: 20,
  [Stage.CHAMPION]: 50,
  [Stage.ULTIMATE]: 100,
  [Stage.MEGA]: 200,
};

export const GAME_ITEMS: Record<string, ItemDefinition> = {
  // FOOD
  'energy_chip': {
    id: 'energy_chip',
    name: 'Energy Chip',
    description: 'Restores vital data structures.',
    category: ItemCategory.FOOD,
    effects: { [StatType.ENERGY]: 20 },
    icon: '⚡'
  },
  'protein_bit': {
    id: 'protein_bit',
    name: 'Protein Bit',
    description: 'Dense data for muscle growth.',
    category: ItemCategory.FOOD,
    effects: { [StatType.ENERGY]: 10, [StatType.POWER]: 5 },
    icon: '🥩'
  },
  'comfort_berry': {
    id: 'comfort_berry',
    name: 'Comfort Berry',
    description: 'Sweet data that soothes the core.',
    category: ItemCategory.FOOD,
    effects: { [StatType.ENERGY]: 5, [StatType.BOND]: 10, [StatType.STABILITY]: 5 },
    icon: '🍓'
  },
  
  // TRAINING
  'data_weight': {
    id: 'data_weight',
    name: 'Heavy Data',
    description: 'Increases gravity for training.',
    category: ItemCategory.TRAINING,
    effects: { [StatType.POWER]: 15, [StatType.ENERGY]: -10 },
    icon: '🏋️'
  },
  'focus_ring': {
    id: 'focus_ring',
    name: 'Focus Ring',
    description: 'Stabilizes data flow.',
    category: ItemCategory.TRAINING,
    effects: { [StatType.STABILITY]: 15, [StatType.ENERGY]: -5 },
    icon: '💍'
  },
  'logic_puzzle': {
    id: 'logic_puzzle',
    name: 'Logic Core',
    description: 'Stimulates AI curiosity.',
    category: ItemCategory.TRAINING,
    effects: { [StatType.CURIOSITY]: 15, [StatType.ENERGY]: -5 },
    icon: '🧩'
  },

  // SPECIAL
  'memory_shard': {
    id: 'memory_shard',
    name: 'Memory Shard',
    description: 'A fragment of ancient data.',
    category: ItemCategory.SPECIAL,
    effects: { [StatType.BOND]: 20 },
    icon: '💎'
  },
  'fusion_core': {
    id: 'fusion_core',
    name: 'Fusion Core',
    description: 'Catalyst for merging data streams.',
    category: ItemCategory.CATALYST,
    effects: { [StatType.STABILITY]: 20 },
    icon: '⚛️'
  }
};

export const INITIAL_INVENTORY = {
  'energy_chip': 3,
  'comfort_berry': 2,
  'fusion_core': 1
};