import dbConnect from "@/db/db";
import { Message } from "@/models/message.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("userId");

  if(!uid){
    return NextResponse.json({
        success: false,
        message: "User Id not found"
    }, { status: 401 })
  }

  try {
    await dbConnect();

    const scheduledMessages = await Message.find({
      isScheduled: true,
      sender_id: uid,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!scheduledMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "No Scheduled message",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Scheduled message fetched successfully",
        messages: scheduledMessages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error while fetching the messages",
      },
      { status: 500 }
    );
  }
}
