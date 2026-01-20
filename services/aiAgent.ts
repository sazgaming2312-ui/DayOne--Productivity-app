
import { GoogleGenAI } from "@google/genai";
import { Task } from '../types';

export const DayOneAgent = {
  /**
   * Acts as a backend AI agent providing strategic productivity advice
   */
  getStrategicAdvice: async (tasks: Task[]): Promise<string> => {
    // FIX: Initialize GoogleGenAI inside the method to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const pendingTasks = tasks.filter(t => !t.isCompleted);
      const taskContext = pendingTasks.map(t => `- ${t.title} (${t.priority}, ${t.category})`).join('\n');

      const response = await ai.models.generateContent({
        // Use Pro model for complex reasoning and strategic planning
        model: 'gemini-3-pro-preview',
        contents: `You are the DayOne Productivity Agent. 
        Current User Tasks:
        ${taskContext || 'No current pending tasks.'}

        Provide a concise, motivating (2-3 sentences) strategic advice on what the user should focus on next based on priorities and categories. 
        Be professional but encouraging.`,
        config: {
          temperature: 0.7,
          // FIX: When setting maxOutputTokens, thinkingBudget must also be set for Gemini 3 models
          maxOutputTokens: 250,
          thinkingConfig: { thinkingBudget: 150 }
        }
      });

      // FIX: Accessing .text property directly instead of text()
      return response.text || "Keep moving forward! You're doing great.";
    } catch (error) {
      console.error("Agent Error:", error);
      return "I'm having trouble analyzing your schedule right now.";
    }
  }
};
