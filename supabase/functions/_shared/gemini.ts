/**
 * Shared Gemini AI Module for Supabase Functions
 * Handles all interactions with Google's Generative AI API
 * 
 * Runs on Deno runtime (Supabase Edge Functions)
 */

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GenerateResponseOptions {
  userMessage: string;
  context?: string;
  systemPrompt?: string;
  maxTokens?: number;
}

// Helper to get environment variables
// Works in Deno environment
function getEnvVar(key: string): string | undefined {
  // In Deno environment, use globalThis
  return (globalThis as any)?.Deno?.env?.get?.(key);
}

/**
 * Initialize Gemini client
 */
export function initializeGemini(apiKey: string) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  // Note: In Deno environment, we'll use native fetch with Gemini API
  return apiKey;
}

/**
 * Generate AI response using Gemini
 * Used for creating bank officer responses to scammers
 */
export async function generateAIResponse(
  options: GenerateResponseOptions
): Promise<string> {
  const apiKey = getEnvVar("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const model = "gemini-1.5-flash"; // Using flash for speed
  const systemPrompt =
    options.systemPrompt ||
    "You are a helpful AI assistant responding to messages.";

  // Build the prompt
  const fullPrompt = `${systemPrompt}

Context: ${options.context || ""}

User Message: "${options.userMessage}"

Generate a response that is under ${options.maxTokens || 100} tokens.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: options.maxTokens || 100,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API Error: ${error}`);
    }

    const data = await response.json();

    // Extract the text from the response
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
    ) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    throw new Error("No content in Gemini response");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

/**
 * Analyze scam conversation with Gemini
 */
export async function analyzeScamConversation(
  conversationHistory: string
): Promise<{
  analysisType: string;
  confidence: number;
  suggestions: string[];
  riskLevel: "low" | "medium" | "high";
}> {
  const analysisPrompt = `Analyze this scam conversation and provide:
1. Classification of scam type
2. Confidence score (0-100)
3. Suggestions for agent responses
4. Risk level assessment

Conversation:
${conversationHistory}

Respond in JSON format with keys: analysisType, confidence, suggestions (array), riskLevel`;

  const response = await generateAIResponse({
    userMessage: conversationHistory,
    systemPrompt:
      "You are an expert fraud analyst. Analyze the conversation and respond ONLY with valid JSON.",
    maxTokens: 300,
  });

  try {
    // Extract JSON from response (in case there's other text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    return {
      analysisType: "unknown",
      confidence: 0,
      suggestions: [],
      riskLevel: "medium",
    };
  }
}

/**
 * Generate voice command response
 */
export async function generateVoiceCommand(
  userInput: string,
  systemPrompt: string
): Promise<string> {
  const response = await generateAIResponse({
    userMessage: userInput,
    systemPrompt: systemPrompt,
    maxTokens: 150,
  });

  // Ensure the response is under 1-2 sentences for voice
  const sentences = response.split(/[.!?]+/);
  return (sentences[0] + (sentences.length > 1 ? sentences[1] : ""))
    .trim()
    .substring(0, 300); // Limit to ~300 chars for TTS
}
