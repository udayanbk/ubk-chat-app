import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { userId, url } = await req.json();

  await User.findByIdAndUpdate(userId, { avatar: url });

  return NextResponse.json({ success: true });
}
