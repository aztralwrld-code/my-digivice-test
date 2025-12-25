import { GoogleGenAI } from "@google/genai";
import { Creature, ActionType, Stage, EvolutionOption, ItemDefinition } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateCreatureResponse = async (
  creature: Creature,
  action: ActionType | 'USE_ITEM',
  context?: string
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "...";

  const prompt = `
    Roleplay as a digital creature in a retro-futuristic device (Aether Link).
    
    CREATURE STATE:
    - Name: ${creature.name}
    - Stage: ${creature.stage}
    - Traits: ${creature.traits.join(", ")}
    - Mood: Energy ${creature.stats.Energy}, Bond ${creature.stats.Bond}
    
    ACTION RECEIVED: "${action}"
    DETAILS: ${context || "None"}

    OUTPUT RULES:
    1. Short, visceral reaction (max 15 words).
    2. Style: Digital biology, glitch aesthetic, cute or fierce depending on stage.
    3. No quotes.
    
    Examples:
    - "System purrs warmly."
    - "Data crunching sounds... satisfied."
    - "Sparks fly! Power overflowing!"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "*processes input silently*";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "*glitches momentarily*";
  }
};

export const generateEvolutionOptions = async (
  oldStage: Stage,
  newStage: Stage,
  stats: Creature['stats'],
  currentTraits: string[]
): Promise<EvolutionOption[]> => {
  const ai = getClient();
  // Fallback if no API key
  if (!ai) return [{
    name: "Glitchmon",
    description: "A form unstable due to connection errors.",
    traits: ["Unstable"],
    type: "Virus",
    color: "#64748b"
  }];

  const prompt = `
    A digital creature is evolving from ${oldStage} to ${newStage}.
    Current Traits: ${currentTraits.join(", ")}
    Stats: 
    - Power: ${stats.Power} (Aggression)
    - Stability: ${stats.Stability} (Order)
    - Bond: ${stats.Bond} (Holy/Light)
    - Curiosity: ${stats.Curiosity} (Data/Intellect)
    
    Generate 2 distinct evolution paths based on these stats.
    
    1. Dominant Path (Based on highest stat).
    2. Divergent Path (Based on hidden potential or secondary stats).

    Return ONLY valid JSON array:
    [
      {
        "name": "Name ending in 'mon'",
        "description": "Visual description (max 15 words)",
        "traits": ["Trait1", "Trait2"],
        "type": "Data/Virus/Vaccine/Free",
        "color": "Hex Color Code"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    return [{
      name: "ErrorMon",
      description: "Evolution data corrupted.",
      traits: ["Glitch"],
      type: "Unknown",
      color: "#ef4444"
    }];
  }
};

export const generateFusionResult = async (
  creatureA: Creature,
  creatureB: Creature
): Promise<{ name: string; description: string; fusionTrait: string; color: string; traits: string[] }> => {
  const ai = getClient();
  if (!ai) return {
    name: "Omegamon (Glitch)",
    description: "A forced fusion of incompatible data.",
    fusionTrait: "Unstable Core",
    color: "#8b5cf6",
    traits: ["Glitch", "Fused"]
  };

  const prompt = `
    FUSION RITUAL INITIATED.
    Parent A: ${creatureA.name} (${creatureA.stage}, ${creatureA.traits.join(',')})
    Parent B: ${creatureB.name} (${creatureB.stage}, ${creatureB.traits.join(',')})
    
    Generate the resulting fused creature.
    It should be one stage higher than the parents (or same stage if parents are Mega).
    
    Return ONLY valid JSON:
    {
      "name": "Creative Fused Name",
      "description": "Visual description mixing both parents features (max 15 words)",
      "fusionTrait": "A unique passive ability name",
      "color": "Hex code blending parents",
      "traits": ["Trait from A", "Trait from B", "New Trait"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {
      name: "ChimeraMon",
      description: "A chaotic mix of data.",
      fusionTrait: "Chaos Theory",
      color: "#purple",
      traits: ["Chaotic"]
    };
  }
};

export const generateExploreEvent = async (creature: Creature): Promise<{ text: string; itemFound?: string }> => {
  const ai = getClient();
  if (!ai) return { text: "The network is quiet." };

  const prompt = `
    The creature ${creature.name} (${creature.stage}) is exploring the Digital Sea.
    Generate a 1-sentence event description.
    Sometimes (20% chance) mention finding a data fragment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return { text: response.text?.trim() || "Exploration complete." };
  } catch (e) {
    return { text: "Connection unstable." };
  }
};