import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI VOICE RESPONSE SIMULATOR
 * POST /api/ai-response
 *
 * Generates an AI bank official response and converts to speech
 * for Twilio voice simulation
 */

export async function POST(request: NextRequest) {
  try {
    const { lastMessage, context } = await request.json();

    if (!lastMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // ✅ Validate API keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!geminiKey || !elevenLabsKey || !voiceId) {
      return NextResponse.json(
        { error: "Missing API credentials" },
        { status: 500 }
      );
    }

    // 🧠 STEP 1: Generate AI response using Gemini
    console.log("🧠 Generating AI bank official response...");

    const client = new GoogleGenerativeAI(geminiKey);
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a bank security officer responding to a scammer who is trying to steal account information. 
The scammer just said: "${lastMessage}"

Generate a SHORT, FIRM response (1-2 sentences max) that:
1. Pressures them to act quickly
2. Sounds official and authoritative
3. Creates urgency (threat of account freeze, etc.)
4. Does NOT give away that this is a sting operation

Keep it under 50 words. Respond ONLY with the text, no quotes or formatting.`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();

    console.log("✅ Generated response:", aiResponse);

    // 🎤 STEP 2: Convert response to speech using ElevenLabs
    console.log("🎤 Converting to speech...");

    const audioResponse = await fetch("https://api.elevenlabs.io/v1/text-to-speech/MF3mGyEYCl7XYWbV7PZT", {
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
    });

    if (!audioResponse.ok) {
      throw new Error(`ElevenLabs error: ${audioResponse.statusText}`);
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    // 📞 STEP 3: Optionally trigger Twilio call (for production use)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const publicAppUrl = process.env.PUBLIC_APP_URL;

    let callSid = null;

    if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber && context?.targetPhone) {
      try {
        console.log("📞 Making Twilio voice call...");

        const twimlUrl = `${publicAppUrl}/api/speak?text=${encodeURIComponent(aiResponse)}`;

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
        console.warn("⚠️ Twilio call failed (will still return audio):", twilioError);
      }
    }

    return NextResponse.json({
      success: true,
      aiResponse,
      audioUrl,
      callSid,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error generating AI response:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
