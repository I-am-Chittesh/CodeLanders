import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OFFICER_VIKRAM_PROMPT } from "../_shared/prompts.ts";

// Standard CORS headers for Supabase Edge Functions
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. Handle CORS Preflight Requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. Upgrade HTTP to WebSocket
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log("SIREN WEB-SOCKET CONNECTED: Ready to intercept.");
  };

  socket.onmessage = async (event) => {
    try {
      // The frontend sends JSON like: { text: "Hello, where is my money?" }
      const data = JSON.parse(event.data);
      const scammerText = data.text;

      console.log(`[TARGET SAYS]: ${scammerText}`);

      // ---------------------------------------------------------
      // STEP 1: Process with GEMINI (The Brain)
      // ---------------------------------------------------------
      const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      
      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: OFFICER_VIKRAM_PROMPT }] },
          contents: [{ parts: [{ text: scammerText }] }],
        }),
      });

      const geminiData = await geminiResponse.json();
      const vikramResponseText = geminiData.candidates[0].content.parts[0].text;
      console.log(`[VIKRAM REPLIES]: ${vikramResponseText}`);

      // ---------------------------------------------------------
      // STEP 2: Process with ELEVENLABS (The Voice)
      // ---------------------------------------------------------
      const elevenLabsApiKey = Deno.env.get("ELEVENLABS_API_KEY");
      const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // George / Authoritative Male

      const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      const elResponse = await fetch(elevenLabsUrl, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": elevenLabsApiKey!,
        },
        body: JSON.stringify({
          text: vikramResponseText,
          model_id: "eleven_turbo_v2_5", // Turbo model for lowest latency
          voice_settings: {
            stability: 0.3, // Low stability makes it sound more agitated/natural
            similarity_boost: 0.7,
          },
        }),
      });

      // Convert audio ArrayBuffer to Base64 to send over WebSocket
      const audioBuffer = await elResponse.arrayBuffer();
      const audioBytes = new Uint8Array(audioBuffer);
      let binaryString = "";
      for (let i = 0; i < audioBytes.byteLength; i++) {
        binaryString += String.fromCharCode(audioBytes[i]);
      }
      const base64Audio = btoa(binaryString);

      // ---------------------------------------------------------
      // STEP 3: Send back to Frontend/Twilio
      // ---------------------------------------------------------
      socket.send(JSON.stringify({
        text: vikramResponseText,
        audio: base64Audio
      }));

    } catch (error) {
      console.error("Error in SIREN pipeline:", error);
      socket.send(JSON.stringify({ error: "Pipeline failure" }));
    }
  };

  return response;
});