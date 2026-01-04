import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { userId, photoId } = await req.json();

  await User.updateOne(
    { _id: userId },
    { $pull: { photos: { _id: photoId } } }
  );

  return NextResponse.json({ success: true });
}
