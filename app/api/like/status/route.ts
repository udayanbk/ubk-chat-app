import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { userId } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session?.user?._id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await User.findByIdAndUpdate(userId, {
    $addToSet: { statusLikes: session.user._id },
  });

  return NextResponse.json({ success: true });
}
