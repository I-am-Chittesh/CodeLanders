import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

/**
 * SIREN RED ALERT TRIGGER
 * GET /api/trigger-alert - Initiates an outbound call to the Bank Manager
 * 
 * Usage: 
 * Click a button in the UI that calls this endpoint
 * Twilio will immediately call MY_PHONE_NUMBER
 */

export async function GET(request: NextRequest) {
  try {
    // Get environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER; // Your US Twilio number
    const managerNumber = process.env.MY_PHONE_NUMBER; // Your Indian phone number
    const publicUrl = process.env.PUBLIC_APP_URL;

    // ✅ VALIDATION
    if (!accountSid || !authToken || !twilioNumber || !managerNumber) {
      return NextResponse.json(
        {
          error: "Twilio credentials missing",
          missing: [
            !accountSid && "TWILIO_ACCOUNT_SID",
            !authToken && "TWILIO_AUTH_TOKEN",
            !twilioNumber && "TWILIO_PHONE_NUMBER",
            !managerNumber && "MY_PHONE_NUMBER",
          ].filter(Boolean),
        },
        { status: 400 }
      );
    }

    if (!publicUrl) {
      return NextResponse.json(
        {
          error: "PUBLIC_APP_URL not configured",
          solution: "Set PUBLIC_APP_URL in .env.local to your Serveo URL",
          example: "PUBLIC_APP_URL=https://myproject-123.serveo.net",
        },
        { status: 400 }
      );
    }

    // ✅ INITIALIZE TWILIO CLIENT
    const client = twilio(accountSid, authToken);

    // ✅ CREATE OUTBOUND CALL
    const call = await client.calls.create({
      from: twilioNumber, // Your US Twilio number
      to: managerNumber, // Bank Manager's Indian phone
      url: `${publicUrl}/api/alert-response`, // TwiML endpoint
      record: true, // Record the call
      timeout: 60,
    });

    console.log(`🚨 RED ALERT: Call initiated to ${managerNumber}`);
    console.log(`📞 Call SID: ${call.sid}`);

    return NextResponse.json(
      {
        success: true,
        callSid: call.sid,
        status: call.status,
        message: `SIREN RED ALERT activated! Calling ${managerNumber}...`,
        from: twilioNumber,
        to: managerNumber,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ ALERT TRIGGER ERROR:", error);
    return NextResponse.json(
      {
        error: "Failed to trigger alert",
        message: error?.message || String(error),
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for form submissions (optional)
 * Allows triggering from HTML form, not just GET
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
