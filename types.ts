export enum Stage {
  EGG = 'EGG',
  BABY = 'BABY',
  ROOKIE = 'ROOKIE',
  CHAMPION = 'CHAMPION',
  ULTIMATE = 'ULTIMATE',
  MEGA = 'MEGA'
}

export enum StatType {
  ENERGY = 'Energy',
  BOND = 'Bond',
  CURIOSITY = 'Curiosity',
  STABILITY = 'Stability',
  POWER = 'Power'
}

export interface Stats {
  [StatType.ENERGY]: number;
  [StatType.BOND]: number;
  [StatType.CURIOSITY]: number;
  [StatType.STABILITY]: number;
  [StatType.POWER]: number;
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'system' | 'creature' | 'evolution' | 'item' | 'fusion';
  timestamp: number;
}

export interface Creature {
  id: string;
  name: string;
  stage: Stage;
  stats: Stats;
  traits: string[];
  age: number; // in interactions
  formDescription: string;
  color: string;
  evolutionReady: boolean;
  // Fusion Specifics
  isFused?: boolean;
  fusionTrait?: string; // Unique passive
  instability?: number; // 0-100, higher is riskier
  parents?: string[]; // Names of parents for lineage
}

export interface EvolutionOption {
  name: string;
  description: string;
  traits: string[];
  type: string; // e.g. "Data", "Virus", "Vaccine"
  color: string;
}

export enum ItemCategory {
  FOOD = 'FOOD',
  TRAINING = 'TRAINING',
  SPECIAL = 'SPECIAL',
  CATALYST = 'CATALYST'
}

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  effects: Partial<Stats>;
  icon: string;
}

export interface DigidexEntry {
  name: string;
  stage: Stage;
  type: string;
  description: string;
  unlockedAt: number;
}

export type TabView = 'HOME' | 'STATUS' | 'ACTIONS' | 'INVENTORY' | 'DIGIDEX' | 'HATCHERY' | 'FUSION';

export type ActionType = 'FEED' | 'TRAIN' | 'TALK' | 'EXPLORE' | 'REST' | 'DISCIPLINE' | 'CONNECT' | 'BOND' | 'PLAY';

export interface GameState {
  creatures: Creature[];
  activeCreatureId: string;
  hatcherySlots: number;
  logs: LogEntry[];
  isThinking: boolean;
  inventory: Record<string, number>;
  digidex: DigidexEntry[];
  activeTab: TabView;
  lastTickAt: number;
}