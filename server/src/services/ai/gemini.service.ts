import { getGeminiClient } from '../../config/gemini.js';
import { ENV } from '../../config/env.js';
import { SYSTEM_AGRONOMIST_PROMPT } from '../../prompts/system.prompt.js';
import { ZodSchema } from 'zod';

export interface GenerateAIOptions<T> {
  prompt: string;
  systemInstruction?: string;
  zodSchema: ZodSchema<T>;
  imagePart?: {
    inlineData: {
      data: string;
      mimeType: string;
    };
  };
  preferredLanguage?: 'en' | 'kn' | 'hi';
}

/**
 * Cleans potential markdown fences or whitespace around raw JSON from AI
 */
function cleanJsonOutput(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Executes a structured AI request using official @google/genai SDK with strict Zod validation
 */
export async function executeAgronomicAI<T>(options: GenerateAIOptions<T>): Promise<T> {
  const gemini = getGeminiClient();

  const langInstruction = options.preferredLanguage && options.preferredLanguage !== 'en'
    ? `\nIMPORTANT: Respond in language code: "${options.preferredLanguage}" (${options.preferredLanguage === 'kn' ? 'Kannada / ಕನ್ನಡ' : 'Hindi / हिन्दी'}). Keep technical scientific terms in brackets if necessary.`
    : '\nRespond in English.';

  const fullSystemInstruction = (options.systemInstruction || SYSTEM_AGRONOMIST_PROMPT) + langInstruction;

  const contents: any[] = [options.prompt];
  if (options.imagePart) {
    contents.push(options.imagePart);
  }

  const model = ENV.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const response = await gemini.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: fullSystemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    const cleanedJson = cleanJsonOutput(text);
    let parsed: any;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch (parseErr: any) {
      console.error('[GEMINI JSON PARSE ERROR]:', text);
      throw new Error(`Failed to parse AI output as JSON: ${parseErr.message}`);
    }

    // Validate against strict Zod schema
    const validated = options.zodSchema.parse(parsed);
    return validated;
  } catch (error: any) {
    console.error(`[AI SERVICE ERROR ON MODEL ${model}]:`, error);
    if (error.name === 'ZodError') {
      throw new Error(`AI response failed schema validation: ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
}

