import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

/**
 * SIREN SCAMMER CALL SIMULATOR
 * POST /api/scammer-call
 *
 * Flow:
 * 1. Receive audio (user speaking as SCAMMER)
 * 2. Transcribe as SCAMMER's words
 * 3. Generate BANK OFFICIAL's response to scammer
 * 4. Convert BANK response to speech
 * 5. Log full conversation to conversation_log.txt
 * 6. Return both transcripts + audio
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log(`📦 Received scammer audio: ${(audioFile.size / 1024).toFixed(2)} KB`);

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

    // 🎤 STEP 1: Transcribe audio as SCAMMER
    console.log("🎤 Transcribing scammer's audio...");

    const client = new GoogleGenerativeAI(geminiKey);
    const audioBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");

    const model = client.getGenerativeModel({ model: "gemini-1.5-pro" });

    let transcriptionResponse;
    try {
      transcriptionResponse = await model.generateContent([
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
    } catch (geminiError: any) {
      console.error("❌ Gemini API Error:", geminiError.message);
      return NextResponse.json(
        {
          error: "Gemini API error",
          message: geminiError.message || "Check API key and billing",
        },
        { status: 500 }
      );
    }

    const scammerSpeech =
      transcriptionResponse.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log(`✅ Scammer said: "${scammerSpeech.substring(0, 50)}..."`);

    if (!scammerSpeech) {
      return NextResponse.json(
        { error: "Could not transcribe audio" },
        { status: 400 }
      );
    }

    // 🏦 STEP 2: Generate BANK OFFICIAL response
    console.log("🏦 Generating bank response...");

    let bankResponse;
    try {
      bankResponse = await model.generateContent([
        {
          text: `A bank official or police officer is responding to a scammer's call attempt.
The scammer just said: "${scammerSpeech}"

Generate a SHORT (1-2 sentences max) response from the bank official that:
- Acknowledges what the scammer said
- Shows official authority/concern
- Asks for more information OR warns them

Respond with ONLY the response, no quotes, no formatting.`,
        },
      ]);
    } catch (geminiError: any) {
      console.error("❌ Gemini Bank Response Error:", geminiError.message);
      return NextResponse.json(
        {
          error: "Failed to generate bank response",
          message: geminiError.message || "Gemini API error",
        },
        { status: 500 }
      );
    }

    const bankSpeech =
      bankResponse.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "I'm going to need more information about this claim. Can you provide account details?";

    console.log(`🏦 Bank replied: "${bankSpeech}"`);

    // 🔊 STEP 3: Convert BANK response to speech
    console.log("🔊 Converting bank response to speech...");

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const ttsResponse = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": elevenLabsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: bankSpeech,
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

    console.log(`✅ Generated speech: ${(audioBuffer2.byteLength / 1024).toFixed(2)} KB`);

    // 📋 STEP 4: Log to conversation_log.txt
    console.log("📋 Logging conversation to file...");

    const logDir = path.join(process.cwd());
    const logFile = path.join(logDir, "conversation_log.txt");

    const timestamp = new Date().toLocaleString();
    const logEntry = `[${timestamp}] SCAMMER: "${scammerSpeech}"\n[${timestamp}] BANK: "${bankSpeech}"\n\n`;

    fs.appendFileSync(logFile, logEntry, "utf-8");
    console.log(`✅ Logged to ${logFile}`);

    // ✅ STEP 5: Return response
    return NextResponse.json(
      {
        success: true,
        scammer_speech: scammerSpeech,
        bank_speech: bankSpeech,
        audio_base64: audioBase64,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Scammer call error:", error);

    return NextResponse.json(
      {
        error: "Failed to process scammer call",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
