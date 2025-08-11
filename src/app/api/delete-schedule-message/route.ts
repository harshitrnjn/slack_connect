import dbConnect from "@/db/db";
import { Message } from "@/models/message.model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID is required" }, { status: 400 });
    }

    await dbConnect();
    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (err: any) {
    console.error("Delete error:", err.message);
    return NextResponse.json({ success: false, error: "Failed to delete message" }, { status: 500 });
  }
}
