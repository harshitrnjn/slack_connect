// src/app/api/slack/schedule-message/route.ts
import dbConnect from '@/db/db';
import { Message } from '@/models/message.model';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { channel, text, date, time, userId } = await req.json();

    if (!channel || !text || !date || !time || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const sendTime = new Date(`${date}T${time}:00`).getTime();

    const newMessage = await Message.create({
      sender_id: userId,
      channel_id: channel,
      content: text,
      scheduledAt: sendTime,
      isScheduled: true
    });

    return NextResponse.json({
      success: true,
      message: "Message scheduled successfully"
    }, { status: 200 });
  } catch (error: any) {
    console.error('Scheduling error:', error.message);
    return NextResponse.json({ error: 'Failed to schedule message.' }, { status: 500 });
  }
}
