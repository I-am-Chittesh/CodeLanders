/// <reference path="../deno.d.ts" />

import { serve } from "std/http/server.ts";
import { generateVoiceCommand } from "../_shared/gemini.ts";
import { getPrompt } from "../_shared/prompts.ts";

/**
 * CONNECT-CALL FUNCTION
 * Converts AI-generated text to speech and sends to Twilio
 * 
 * This function:
 * 1. Receives either pre-generated text OR a user message to generate from
 * 2. Uses Gemini ML model to generate natural responses
 * 3. Converts text to speech using ElevenLabs
 * 4. Returns audio stream compatible with Twilio phone calls
 */

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    const { text, userMessage, scamType = "general", systemPrompt } =
      (await req.json()) as {
        text?: string;
        userMessage?: string;
        scamType?: string;
        systemPrompt?: string;
      };

    if (!text && !userMessage) {
      return new Response(
        JSON.stringify({
          error: "Either 'text' or 'userMessage' is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: Generate or use provided text
    let voiceText = text;
    if (!text && userMessage) {
      console.log(`🧠 Generating response for scam type: ${scamType}`);
      const prompt = systemPrompt || getPrompt((scamType as any) || "general");
      voiceText = await generateVoiceCommand(userMessage, prompt);
      console.log("✅ Generated text:", voiceText);
    }

    // Validate text length
    if (!voiceText || voiceText.length === 0) {
      throw new Error("No text to convert to speech");
    }

    // Step 2: Get ElevenLabs API credentials
    const elevenLabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!elevenLabsApiKey) {
      throw new Error("ELEVENLABS_API_KEY is not set");
    }

    // Voice ID - Officer Vikram's voice (Indian accent, calm but firm)
    const voiceId = "21m00Tcm4TlvDq8ikWAM";

    console.log(`🎤 Converting to speech (${voiceText.length} chars)`);

    // Step 3: Send request to ElevenLabs
    // The ?output_format=ulaw_8000 is MANDATORY for Twilio phone calls!
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=ulaw_8000`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: voiceText,
          model_id: "eleven_flash_v2_5", // Ultra-fast model - scammers won't hang up waiting
          voice_settings: {
            stability: 0.3, // Low stability = emotional, human, slightly confused
            similarity_boost: 0.7,
            speed: 0.9, // Slightly slower speaking pace (more natural)
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      throw new Error(`ElevenLabs Error: ${errorText}`);
    }

    // Step 4: Get audio buffer
    const audioBuffer = await ttsResponse.arrayBuffer();
    console.log(`✅ Speech generated (${audioBuffer.byteLength} bytes)`);

    // Step 5: Return audio stream to Twilio
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/basic", // Twilio phone audio format
        "Content-Length": audioBuffer.byteLength.toString(),
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("❌ Connect-Call Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate voice response",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});