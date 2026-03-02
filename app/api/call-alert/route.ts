import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, caseData } = await request.json();

    // Validate environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const myPhoneNumber = process.env.MY_PHONE_NUMBER;
    const publicAppUrl = process.env.PUBLIC_APP_URL;

    if (!accountSid || !authToken || !twilioPhoneNumber || !myPhoneNumber) {
      return NextResponse.json(
        { error: "Twilio credentials not configured" },
        { status: 500 }
      );
    }

    if (!publicAppUrl) {
      return NextResponse.json(
        {
          error: "PUBLIC_APP_URL not configured",
          message:
            "Set PUBLIC_APP_URL in .env.local to your Cloudflare Tunnel URL (e.g., https://xxx.trycloudflare.com)",
        },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Create call using public URL
    const call = await client.calls.create({
      url: `${publicAppUrl}/api/call-handler`,
      to: myPhoneNumber,
      from: twilioPhoneNumber,
      record: true,
      statusCallback: `${publicAppUrl}/api/call-status`,
      statusCallbackEvent: ["completed"],
      statusCallbackMethod: "POST",
    });

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      message: `Alert call initiated to ${myPhoneNumber}`,
    });
  } catch (error) {
    console.error("Twilio call error:", error);
    return NextResponse.json(
      { error: "Failed to initiate call", details: String(error) },
      { status: 500 }
    );
  }
}
