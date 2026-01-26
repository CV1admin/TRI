
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing from environment.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateQuantumReasoning = async (prompt: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });
  return response.text || "Reasoning engine failed to stabilize output.";
};

export const startQuantumChat = (history: any[] = []) => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });
};
