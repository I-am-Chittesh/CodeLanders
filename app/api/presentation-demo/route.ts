import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

/**
 * SIREN PRESENTATION DEMO - Live Interaction Endpoint
 * POST /api/presentation-demo
 *
 * Flow:
 * 1. Receive audio from user (MediaRecorder blob)
 * 2. Transcribe using Gemini AI
 * 3. Generate scammer response
 * 4. Convert response to speech using ElevenLabs
 * 5. Log interaction to demo_evidence_log.txt
 * 6. Return JSON with transcript, reply, and base64 audio
 */

export async function POST(request: NextRequest) {
  try {
    // 📝 Parse FormData from frontend
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log(`📦 Received audio blob: ${(audioFile.size / 1024).toFixed(2)} KB`);

    // ✅ Validate API keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    if (!geminiKey || !elevenLabsKey || !voiceId) {
      return NextResponse.json(
        {
          error: "Missing API credentials",
          missing: [
            !geminiKey && "GEMINI_API_KEY",
            !elevenLabsKey && "ELEVENLABS_API_KEY",
            !voiceId && "ELEVENLABS_VOICE_ID",
          ].filter(Boolean),
        },
        { status: 500 }
      );
    }

    // 🎤 STEP 1: Transcribe audio using Gemini
    console.log("🎤 Transcribing audio with Gemini...");

    const client = new GoogleGenerativeAI(geminiKey);
    const audioBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

    const transcriptionResponse = await model.generateContent([
      {
        inlineData: {
          mimeType: audioFile.type || "audio/webm",
          data: base64Audio,
        },
      },
      {
        text: "Transcribe this audio and provide only the text said. Do not add any formatting or explanation.",
      },
    ]);

    const userTranscript =
      transcriptionResponse.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log(`✅ Transcribed: "${userTranscript.substring(0, 50)}..."`);

    // 🤖 STEP 2: Generate scammer response using Gemini
    console.log("🤖 Generating scammer reply...");

    const scammerResponse = await model.generateContent([
      {
        text: `You are a sophisticated bank scammer who uses social engineering. 
The user just said: "${userTranscript}"

Generate a SHORT (1 sentence max) convincing response that:
- Pretends to be a bank official
- Creates urgency or fear
- Asks for sensitive information or action

Respond with ONLY the one-line reply, no quotes, no formatting.`,
      },
    ]);

    const aiReply =
      (scammerResponse.response.candidates?.[0]?.content?.parts?.[0]?.text || "").trim() ||
      "Your account has been compromised. Please verify your credentials immediately.";

    console.log(`🎭 Scammer reply: "${aiReply}"`);

    // 🔊 STEP 3: Generate speech using ElevenLabs
    console.log("🔊 Converting reply to speech...");

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const ttsResponse = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: aiReply,
        model_id: "eleven_turbo_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error("❌ ElevenLabs error:", errorText);
      return NextResponse.json(
        { error: "Text-to-speech conversion failed" },
        { status: 500 }
      );
    }

    const audioBuffer2 = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer2).toString("base64");

    console.log(`✅ Generated audio: ${(audioBuffer2.byteLength / 1024).toFixed(2)} KB`);

    // 📋 STEP 4: Log to demo_evidence_log.txt
    console.log("📋 Logging to demo_evidence_log.txt...");

    const logDir = path.join(process.cwd());
    const logFile = path.join(logDir, "demo_evidence_log.txt");

    const timestamp = new Date().toLocaleString();
    const logEntry = `[${timestamp}] User: "${userTranscript}" | AI: "${aiReply}"\n`;

    fs.appendFileSync(logFile, logEntry, "utf-8");
    console.log(`✅ Logged to ${logFile}`);

    // ✅ STEP 5: Return response
    return NextResponse.json(
      {
        success: true,
        user_transcript: userTranscript,
        ai_reply: aiReply,
        audio_base64: audioBase64,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Presentation demo error:", error);

    return NextResponse.json(
      {
        error: "Failed to process interaction",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
