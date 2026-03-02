import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Twilio expects TwiML XML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="woman">
    ALERT: SIREN system has detected and intercepted a scam call. 
    Account number has been successfully extracted. 
    Case report is being generated and will be sent to your dashboard immediately.
    The target phone number and location data are being logged for law enforcement action.
  </Say>
  <Pause length="2"/>
  <Say voice="woman">
    Press 1 to acknowledge and view the full forensic report.
    Press 2 to transfer to law enforcement coordination.
  </Say>
  <Gather numDigits="1" timeout="10">
    <Say voice="woman">Press a key</Say>
  </Gather>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Call handler error:", error);
    return NextResponse.json(
      { error: "Failed to handle call" },
      { status: 500 }
    );
  }
}
