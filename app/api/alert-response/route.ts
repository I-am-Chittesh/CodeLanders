import { NextRequest, NextResponse } from "next/server";

/**
 * SIREN ALERT RESPONSE - TwiML Handler
 * POST /api/alert-response
 * 
 * This endpoint is called by Twilio when the recipient answers the phone.
 * Serves TwiML XML to play the voice alert message.
 */

export async function POST(request: NextRequest) {
  try {
    // Parse Twilio's incoming request
    const body = await request.text();
    const params = new URLSearchParams(body);

    const callSid = params.get("CallSid");
    const from = params.get("From");
    const to = params.get("To");

    console.log(`📞 Incoming call received:`);
    console.log(`   Call SID: ${callSid}`);
    console.log(`   From: ${from}`);
    console.log(`   To: ${to}`);

    // ✅ CREATE TWIML RESPONSE
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-IN">
    This is SIREN priority alert. Fraud detected on the secure line.
    A scammer has been intercepted during a social engineering attack.
    Account details have been extracted.
    The forensic report is being generated and will be available on your dashboard immediately.
    Coordinates and threat indicators have been logged for law enforcement action.
  </Say>
  <Pause length="1"/>
  <Say voice="alice">
    Press 1 to acknowledge and view the forensic report.
    Press 2 to transfer to law enforcement coordination.
    Press 3 to hear this message again.
  </Say>
  <Gather numDigits="1" timeout="15">
    <Say voice="alice">Press a key to continue</Say>
  </Gather>
  <Redirect>/api/alert-followup</Redirect>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("❌ Alert response error:", error);

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Error processing alert. Please contact the SIREN administrator.
  </Say>
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
