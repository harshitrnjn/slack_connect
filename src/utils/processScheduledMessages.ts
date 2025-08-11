import dbConnect from "@/db/db";
import { Message } from "@/models/message.model";
import axios from "axios";
import { getValidAccessToken } from "@/utils/slackApi";

export async function processScheduledMessages() {
  await dbConnect();

  const now = Date.now();

  // Find pending messages that are due
  const messages = await Message.find({
    isScheduled: true,
    status: "pending",
    scheduledAt: { $lte: now },
  });

  for (const msg of messages) {
    try {
      const token = await getValidAccessToken(msg.sender_id);

      const res = await axios.post(
        "https://slack.com/api/chat.postMessage",
        { channel: msg.channel_id, text: msg.content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.ok) {
        msg.status = "sent";
        await msg.save();
        console.log(`✅ Sent scheduled message: ${msg._id}`);
      } else {
        console.error(`❌ Slack API Error: ${res.data.error}`);
      }
    } catch (err: any) {
      console.error(`❌ Error sending scheduled message: ${err.message}`);
    }
  }
}
