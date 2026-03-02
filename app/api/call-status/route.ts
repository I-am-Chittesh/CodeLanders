import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const callSid = params.get("CallSid");
    const callStatus = params.get("CallStatus");
    const duration = params.get("CallDuration");

    console.log(`Call ${callSid} completed with status: ${callStatus}, duration: ${duration}s`);

    // Log to your database or monitoring system here
    // await logCallStatus({ callSid, callStatus, duration });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Call status error:", error);
    return NextResponse.json({ error: "Failed to log call status" }, { status: 500 });
  }
}
