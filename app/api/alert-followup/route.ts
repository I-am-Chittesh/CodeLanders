import { NextRequest, NextResponse } from "next/server";

/**
 * SIREN ALERT FOLLOWUP - Handle User Input
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

    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>`;

    switch (digits) {
      case "1":
        // Press 1: Display forensic report
        twiml += `
  <Say voice="alice">
    Opening forensic report on your dashboard. The case details, transcript, and threat assessment are now live.
  </Say>
  <Hangup/>`;
        break;

      case "2":
        // Press 2: Transfer to law enforcement
        twiml += `
  <Say voice="alice">
    Connecting you with law enforcement coordination. Please wait.
  </Say>
  <Dial timeout="30">
    <Number>${process.env.TEAMMATE_PHONE_NUMBER}</Number>
  </Dial>`;
        break;

      case "3":
        // Press 3: Repeat message
        twiml += `
  <Say voice="alice">
    This is SIREN priority alert. Fraud detected on the secure line.
    A scammer has been intercepted during a social engineering attack.
    Account details have been extracted.
    The forensic report is being generated.
  </Say>
  <Pause length="1"/>
  <Say voice="alice">
    Press 1 to acknowledge and view the forensic report.
    Press 2 to transfer to law enforcement coordination.
  </Say>
  <Gather numDigits="1" timeout="15">
    <Say voice="alice">Press a key to continue</Say>
  </Gather>
  <Redirect>/api/alert-followup</Redirect>`;
        break;

      default:
        // Invalid input
        twiml += `
  <Say voice="alice">Invalid input. Please press 1, 2, or 3.</Say>
  <Redirect>/api/alert-response</Redirect>`;
    }

    twiml += `
</Response>`;

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
