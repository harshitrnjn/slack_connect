// src/app/api/slack/status/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { User } from "@/models/user.model";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const user = await User.findById(userId);
  return NextResponse.json({ connected: !!user?.slack?.access_token });
}

