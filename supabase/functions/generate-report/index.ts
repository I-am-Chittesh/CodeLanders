/// <reference path="../deno.d.ts" />

import { serve } from "std/http/server.ts";
import { generateAIResponse } from "../_shared/gemini.ts";

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
      callData,
      transcription,
      recordingUrl,
      duration,
      scamType,
    } = (await req.json()) as {
      callData?: Record<string, unknown>;
      transcription?: string;
      recordingUrl?: string;
      duration?: number;
      scamType?: string;
    };

    if (!callData && !transcription) {
      return new Response(
        JSON.stringify({
          error: "callData or transcription is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      "📊 Generating report for scam call analysis"
    );

    // Generate comprehensive report
    const reportPrompt = `Generate a detailed forensic report for this scam call interaction:

Call Information:
- Type: ${scamType || "Unknown"}
- Duration: ${duration || "Unknown"}
- Recording: ${recordingUrl || "N/A"}

Transcription:
${transcription || JSON.stringify(callData, null, 2)}

Please generate a report in Markdown format that includes:
1. Executive Summary
2. Scam Type Classification
3. Red Flags Identified
4. Techniques Used (manipulation, urgency, deception)
5. Information Compromised (if any)
6. Recommendations for Victims
7. Law Enforcement Contacts

Format as Markdown without code blocks.`;

    const reportContent = await generateAIResponse({
      userMessage: reportPrompt,
      systemPrompt:
        "You are a forensic fraud analyst. Generate a detailed, professional report.",
      maxTokens: 800,
    });

    // Extract threat metrics
    const metricsPrompt = `Based on this transcription, provide threat metrics as JSON:
${transcription || JSON.stringify(callData, null, 2)}

Respond ONLY with JSON:
{
  "threatlevel": 1-10,
  "sophistication": 1-10,
  "successrate": 1-10,
  "victimrisk": 1-10,
  "keyindicators": ["indicator1", "indicator2"],
  "preventionmeasures": ["measure1", "measure2"]
}`;

    const metricsResponse = await generateAIResponse({
      userMessage: metricsPrompt,
      systemPrompt:
        "You are a threat assessment AI. Respond ONLY with valid JSON.",
      maxTokens: 300,
    });

    let metrics = {
      threatLevel: 5,
      sophistication: 5,
      successRate: 5,
      victimRisk: 5,
      keyIndicators: [],
      preventionMeasures: [],
    };

    try {
      const parsed = JSON.parse(metricsResponse);
      metrics = {
        threatLevel: parsed.threatlevel || 5,
        sophistication: parsed.sophistication || 5,
        successRate: parsed.successrate || 5,
        victimRisk: parsed.victimrisk || 5,
        keyIndicators: parsed.keyindicators || [],
        preventionMeasures: parsed.preventionmeasures || [],
      };
    } catch (e) {
      console.warn("Could not parse metrics JSON, using defaults");
    }

    return new Response(
      JSON.stringify({
        success: true,
        report: {
          title: `Scam Analysis Report - ${scamType || "Unknown Type"}`,
          generatedAt: new Date().toISOString(),
          content: reportContent,
          metrics: metrics,
          callDuration: duration,
          recordingUrl: recordingUrl,
        },
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
    console.error("❌ Error generating report:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate report",
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
