import { processScheduledMessages } from "@/utils/processScheduledMessages";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await processScheduledMessages();
    return NextResponse.json({ success: true, message: "Processed scheduled messages" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
