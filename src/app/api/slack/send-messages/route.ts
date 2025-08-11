// src/app/api/slack/send-messages/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getValidAccessToken } from "@/utils/slackApi";

export async function POST(req: Request) {
  try {
    const { channel, text, userId } = await req.json();

    // Validate request fields
    if (!channel || !text || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing channel, text, or userId." },
        { status: 400 }
      );
    }

    // Get valid Slack access token (bot token preferred)
    const token = await getValidAccessToken(userId);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Failed to retrieve Slack token." },
        { status: 401 }
      );
    }

    // Send message to Slack channel
    const slackResponse = await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = slackResponse.data;

    if (!result.ok) {
      console.error("Slack API error:", result.error);
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent!",
      data: result,
    });
  } catch (error: any) {
    console.error("Error sending Slack message:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
