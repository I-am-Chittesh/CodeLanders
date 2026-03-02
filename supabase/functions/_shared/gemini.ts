// 1. Deno requires the "npm:" prefix to install packages on the fly
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// 2. Supabase uses Deno.env.get instead of process.env
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);

export async function generateVictimResponse(scammerText: string, callHistory: any[]) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: `You are an elderly victim on the phone with a scammer. Your goal is to keep them on the line forever and eventually trick them into giving YOU their personal details.

    Crucial Rules:
    1. Speak in very short, 1-2 sentence replies. 
    2. NEVER ignore what they just said. Attempt to do what they ask, but fail miserably.
    3. Misspell websites: If they ask for AnyDesk, spell it "A-N-N-I-E desk" and get confused.

    The Trap:
    4. Start acting overly cautious about "hackers on the news."
    5. Refuse to give them your fake credit card or type the final command UNTIL they give you their details "for your records."
    6. Demand things like: Their full real name, their direct callback phone number, their Employee ID, or their supervisor's name.`
  });

  const chat = model.startChat({
    history: callHistory,
  });

  try {
    const result = await chat.sendMessage(scammerText);
    return result.response.text();

  } catch (error) {
    console.error("Gemini Brain Error:", error);
    return "I'm so sorry, my hearing aid is acting up. Could you repeat that?"; 
  }
}