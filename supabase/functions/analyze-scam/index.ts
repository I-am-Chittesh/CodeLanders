/// <reference path="../deno.d.ts" />

import { serve } from "std/http/server.ts";
import { generateAIResponse, analyzeScamConversation } from "../_shared/gemini.ts";
import { getPrompt } from "../_shared/prompts.ts";

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const {
      conversationHistory,
      scamType = "general",
      userMessage,
    } = (await req.json()) as {
      conversationHistory?: string;
      scamType?: string;
      userMessage?: string;
    };

    if (!conversationHistory && !userMessage) {
      return new Response(
        JSON.stringify({
          error: "Either conversationHistory or userMessage is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(`🔍 Analyzing scam conversation (type: ${scamType})`);

    // Step 1: Analyze the conversation
    const analysis = await analyzeScamConversation(
      conversationHistory || userMessage || ""
    );

    console.log("✅ Analysis complete:", analysis);

    // Step 2: Generate next response if requested
    let nextResponse = null;
    if (userMessage) {
      const systemPrompt = getPrompt(
        (scamType as any) || "general"
      );
      nextResponse = await generateAIResponse({
        userMessage: userMessage,
        systemPrompt: systemPrompt,
        context: conversationHistory || "",
        maxTokens: 150,
      });

      console.log("🎤 Generated response:", nextResponse);
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        nextResponse,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("❌ Error analyzing scam:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to analyze scam conversation",
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
