import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const me = await User.findOne({ email: session.user.email });
  if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { receiverId, message } = await req.json();

  const receiver = await User.findById(receiverId);
  if (!receiver) return NextResponse.json({ error: "Receiver not found" }, { status: 404 });

  const msg = await Message.create({
    sender: me._id,
    receiver: receiverId,
    message,
  });

  return NextResponse.json({
    message: {
      _id: msg._id,
      message: msg.message,
      senderId: me._id,
      senderEmail: me.email,
      receiverId,
      receiverEmail: receiver.email,
      createdAt: msg.createdAt,
    },
  });
}

export async function GET(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ messages: [] });
  }

  const me = await User.findOne({ email: session.user.email });
  if (!me) return NextResponse.json({ messages: [] });

  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ messages: [] });

  const messages = await Message.find({
    $or: [
      { sender: me._id, receiver: userId },
      { sender: userId, receiver: me._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "email")
    .populate("receiver", "email");

  return NextResponse.json({
    messages: messages.map((m) => ({
      _id: m._id,
      message: m.message,
      senderId: m.sender._id,
      senderEmail: m.sender.email,
      receiverId: m.receiver._id,
      receiverEmail: m.receiver.email,
      createdAt: m.createdAt,
    })),
  });
}
