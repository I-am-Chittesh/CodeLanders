import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI VOICE RESPONSE SIMULATOR
 * POST /api/ai-response
 *
 * Generates an AI bank official response and converts to speech
 * for Twilio voice simulation
 * 
 * This leverages the Gemini ML model to generate natural, context-aware
 * responses based on different scam types.
 */

interface AIResponseRequest {
  lastMessage: string;
  context?: {
    targetPhone?: string;
    scamType?: string;
    conversationHistory?: string[];
  };
  scamType?: string;
}

// System prompts for different scam types
const SCAM_PROMPTS: Record<string, string> = {
  bank_impersonation: `You are a bank security officer responding to a potential fraud victim. 
The person just said: "{message}"

Generate a SHORT (1-2 sentences max) response that:
1. Sounds official and urgent
2. Creates fear about account compromise
3. Asks for verification details
4. Minimizes latency for voice transmission

Keep under 50 words. Respond ONLY with the dialog text, no explanations.`,

  tech_support: `You are a Microsoft tech support representative who detected malware on the customer's computer.
The customer just said: "{message}"

Generate a response (1-2 sentences max) that:
1. Sounds technical but concerned
2. Recommends immediate action (remote access)
3. Creates urgency about data security
4. Builds trust and authority

Keep under 60 words. Pure dialog text only.`,

  romance_scam: `You are someone the person has been talking to romantically online.
They just said: "{message}"

Generate an emotional, personal response (1-2 sentences max) that:
1. Shows vulnerability and trust
2. References details they might remember
3. Asks for help/money naturally
4. Maintains the emotional connection

Keep under 80 words. Conversational tone only.`,

  officer_vikram: `You are Officer Vikram, a tired NPCI bank auditor. The person just said: "{message}"

Generate a SHORT, blunt response (1-2 sentences max) that:
1. Sounds frustrated and bureaucratic
2. Pressures them to act quickly
3. Uses Indian banking jargon naturally
4. Threatens account freezes or cancellations

Keep under 50 words. Gruff, direct dialog only.`,

  general: `Generate a SHORT scam response (1-2 sentences max) to this message: "{message}"

The response should:
1. Create urgency and pressure
2. Sound convincing and authoritative
3. Ask for verification or action
4. Be under 50 words

Respond ONLY with the dialog text.`,
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AIResponseRequest;
    const { lastMessage, context, scamType = "general" } = body;

    if (!lastMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // ✅ Validate API keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "MF3mGyEYCl7XYWbV7PZT";

    if (!geminiKey || !elevenLabsKey) {
      return NextResponse.json(
        { error: "Missing API credentials" },
        { status: 500 }
      );
    }

    // 🧠 STEP 1: Generate AI response using Gemini
    console.log(`🧠 Generating AI response (type: ${scamType})...`);

    const client = new GoogleGenerativeAI(geminiKey);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const basePrompt = SCAM_PROMPTS[scamType] || SCAM_PROMPTS.general;
    const prompt = basePrompt.replace("{message}", lastMessage);

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();

    console.log("✅ Generated response:", aiResponse);

    // 🎤 STEP 2: Convert response to speech using ElevenLabs
    console.log("🎤 Converting to speech...");

    const audioResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: aiResponse,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text();
      throw new Error(`ElevenLabs error: ${errorText}`);
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    console.log("✅ Audio generated:", audioBase64.length, "bytes");

    // 📞 STEP 3: Optionally trigger Twilio call (for production use)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const publicAppUrl = process.env.PUBLIC_APP_URL;

    let callSid = null;

    if (
      twilioAccountSid &&
      twilioAuthToken &&
      twilioPhoneNumber &&
      context?.targetPhone
    ) {
      try {
        console.log("📞 Making Twilio voice call...");

        const twimlUrl = `${publicAppUrl}/api/speak?text=${encodeURIComponent(
          aiResponse
        )}`;

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Calls.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${twilioAccountSid}:${twilioAuthToken}`
              ).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              From: twilioPhoneNumber,
              To: context.targetPhone,
              Url: twimlUrl,
            }).toString(),
          }
        );

        const callData = await response.json();
        callSid = callData.sid;
        console.log("✅ Twilio call initiated:", callSid);
      } catch (twilioError) {
        console.warn(
          "⚠️ Twilio call failed (will still return audio):",
          twilioError
        );
      }
    }

    return NextResponse.json({
      success: true,
      aiResponse,
      audioUrl,
      callSid,
      scamType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error generating AI response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
