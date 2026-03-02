import { NextRequest, NextResponse } from "next/server";

/**
 * SIREN ALERT FOLLOWUP - Handle User Input with ElevenLabs Voice
 * POST /api/alert-followup
 *
 * Processes DTMF (dial tone) input from the call recipient.
 * - Press 1: Display forensic report
 * - Press 2: Transfer to law enforcement
 * - Press 3: Repeat message
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const digits = params.get("Digits");
    const callSid = params.get("CallSid");

    console.log(`🔘 User pressed: ${digits} (Call SID: ${callSid})`);

    const publicUrl = process.env.PUBLIC_APP_URL || `${request.nextUrl.origin}`;

    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
`;

    if (digits === "1") {
      // Press 1: Display forensic report
      const text = "Opening forensic report on your dashboard. The case details, transcript, and threat assessment are now live.";
      twiml += `  <Play>${publicUrl}/api/speak?text=${encodeURIComponent(text)}</Play>
  <Hangup/>
`;
    } else if (digits === "2") {
      // Press 2: Transfer to law enforcement
      const text = "Connecting you with law enforcement coordination. Please wait.";
      twiml += `  <Play>${publicUrl}/api/speak?text=${encodeURIComponent(text)}</Play>
  <Dial timeout="30">
    <Number>${process.env.TEAMMATE_PHONE_NUMBER}</Number>
  </Dial>
`;
    } else if (digits === "3") {
      // Press 3: Repeat message
      const repeatText =
        "This is SIREN priority alert. Fraud detected on the secure line. A scammer has been intercepted during a social engineering attack. Account details have been extracted. The forensic report is being generated.";
      const promptText =
        "Press 1 to acknowledge and view the forensic report. Press 2 to transfer to law enforcement coordination.";

      twiml += `  <Play>${publicUrl}/api/speak?text=${encodeURIComponent(repeatText)}</Play>
  <Pause length="1"/>
  <Play>${publicUrl}/api/speak?text=${encodeURIComponent(promptText)}</Play>
  <Gather numDigits="1" timeout="15">
    <Play>${publicUrl}/api/speak?text=Press%20a%20key%20to%20continue</Play>
  </Gather>
  <Redirect>/api/alert-followup</Redirect>
`;
    } else {
      // Invalid input
      const text = "Invalid input. Please press 1, 2, or 3.";
      twiml += `  <Play>${publicUrl}/api/speak?text=${encodeURIComponent(text)}</Play>
  <Redirect>/api/alert-response</Redirect>
`;
    }

    twiml += `</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("❌ Followup error:", error);

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Error processing your input. Call ended.</Say>
  <Hangup/>
</Response>`;

    return new NextResponse(errorTwiml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
