import { NextRequest, NextResponse } from "next/server";

/**
 * SIREN TEXT-TO-SPEECH STREAMING ENDPOINT
 * GET /api/speak?text=your+text+here
 *
 * Converts text to speech using ElevenLabs Turbo v2 and returns raw audio stream.
 * Compatible with Twilio's <Play> verb for dynamic voice synthesis.
 *
 * Usage in TwiML:
 * <Play>https://yoururl.com/api/speak?text=Hello%20world</Play>
 */

export async function GET(request: NextRequest) {
  try {
    // 📝 Extract text from query parameter
    const searchParams = request.nextUrl.searchParams;
    const text = searchParams.get("text");

    // ✅ VALIDATION
    if (!text) {
      return NextResponse.json(
        {
          error: "Missing text parameter",
          usage: "/api/speak?text=Hello%20world",
        },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        {
          error: "Text too long (max 500 characters)",
          received: text.length,
        },
        { status: 400 }
      );
    }

    // 🔑 Get credentials
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default: Rachel voice

    if (!apiKey) {
      console.error("❌ ELEVENLABS_API_KEY not configured");
      return NextResponse.json(
        {
          error: "ElevenLabs API key not configured",
          solution: "Add ELEVENLABS_API_KEY to .env.local",
        },
        { status: 500 }
      );
    }

    console.log(`🎤 Speaking: "${text.substring(0, 50)}..."`);
    console.log(`🔊 Voice ID: ${voiceId}`);

    // 📤 CALL ELEVENLABS STREAMING API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const elevenLabsResponse = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_turbo_v2", // ⚡ Lowest latency model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    // ❌ Handle ElevenLabs errors
    if (!elevenLabsResponse.ok) {
      const errorData = await elevenLabsResponse.text();
      console.error("❌ ElevenLabs error:", errorData);

      return NextResponse.json(
        {
          error: "ElevenLabs API error",
          status: elevenLabsResponse.status,
          message: errorData,
        },
        { status: elevenLabsResponse.status }
      );
    }

    // 🔊 Get audio stream from ElevenLabs
    const audioBuffer = await elevenLabsResponse.arrayBuffer();

    console.log(`✅ Generated audio: ${(audioBuffer.byteLength / 1024).toFixed(2)} KB`);

    // 📤 RETURN RAW AUDIO STREAM WITH PROPER HEADERS FOR TWILIO
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("❌ SPEAK endpoint error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate speech",
        message: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST method also supported (for TwiML requests)
 */
export async function POST(request: NextRequest) {
  // Convert POST body to query parameter and handle via GET
  try {
    const body = await request.json();
    const text = body.text || body.message;

    if (!text) {
      return NextResponse.json(
        { error: "Missing text in request body" },
        { status: 400 }
      );
    }

    // Redirect to GET logic
    const getRequest = new NextRequest(
      new URL(`/api/speak?text=${encodeURIComponent(text)}`, request.url)
    );

    return GET(getRequest);
  } catch (error) {
    console.error("❌ POST error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
