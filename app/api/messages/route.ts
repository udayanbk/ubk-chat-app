import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const me = await User.findOne({ email: session.user.email });
    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { receiverId, message } = await req.json();

    const newMessage = await Message.create({
      sender: me._id,
      receiver: receiverId,
      message,
    });

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (err) {
    console.error("MESSAGE POST ERROR", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ messages: [] });
    }

    const me = await User.findOne({ email: session.user.email });
    if (!me) return NextResponse.json({ messages: [] });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ messages: [] });

    const messages = await Message.find({
      $or: [
        { sender: me._id, receiver: userId },
        { sender: userId, receiver: me._id },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("MESSAGE GET ERROR", err);
    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}
