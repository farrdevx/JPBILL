
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (message: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context}\n\nUser Question: ${message}`,
      config: {
        systemInstruction: "You are PteroAI, a helpful assistant for PteroCloud, a premium Pterodactyl hosting service. You help users troubleshoot server issues, choose the best gaming plans, and understand their billing. Keep answers concise, friendly, and expert-level. Use markdown for formatting.",
      },
    });
    // The response.text property directly returns the generated string (not a method)
    return response.text || "I'm sorry, I couldn't process that request right now.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error connecting to AI assistant.";
  }
};
