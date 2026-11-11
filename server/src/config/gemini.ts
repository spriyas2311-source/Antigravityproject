import { GoogleGenAI } from '@google/genai';
import { ENV } from './env.js';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    if (!ENV.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
    geminiClient = new GoogleGenAI({
      apiKey: ENV.GEMINI_API_KEY
    });
  }
  return geminiClient;
}

