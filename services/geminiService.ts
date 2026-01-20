
import { GoogleGenAI, Type } from "@google/genai";
import { Task, Subtask } from '../types';

// NOTE: In a real production app, you should proxy these requests through your backend 
// to keep your API key secure.

export const GeminiService = {
  /**
   * Generates a suggested breakdown of subtasks based on the task title and description.
   */
  generateSubtasks: async (title: string, description: string): Promise<string[]> => {
    // FIX: Initialize GoogleGenAI inside the method to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        // Model for basic text generation tasks
        model: 'gemini-3-flash-preview',
        contents: `I have a task titled "${title}" with the description: "${description}". 
        Please break this down into 3 to 6 actionable, concise subtasks. 
        Return ONLY a JSON array of strings. Do not include markdown formatting.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      // FIX: Accessing .text property directly instead of text()
      const text = response.text;
      if (!text) return [];
      
      try {
        return JSON.parse(text);
      } catch (e) {
        // Fallback if the model returns markdown wrapped JSON
        const match = text.match(/\[.*\]/s);
        return match ? JSON.parse(match[0]) : [];
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return [];
    }
  },

  /**
   * Suggests a priority level based on the task content.
   */
  suggestPriority: async (title: string, description: string): Promise<string | null> => {
     // FIX: Initialize GoogleGenAI inside the method to ensure it always uses the most up-to-date API key
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

     try {
       const response = await ai.models.generateContent({
         model: 'gemini-3-flash-preview',
         contents: `Based on this task: "${title}" - "${description}", suggest a priority level from [LOW, MEDIUM, HIGH, URGENT]. Return only the word.`,
         config: {
           // FIX: When setting maxOutputTokens, thinkingBudget must also be set for Gemini 3 models
           maxOutputTokens: 20,
           thinkingConfig: { thinkingBudget: 10 }
         }
       });
       // FIX: Accessing .text property directly instead of text()
       return response.text?.trim().toUpperCase() || null;
     } catch (e) {
       return null;
     }
  }
};
