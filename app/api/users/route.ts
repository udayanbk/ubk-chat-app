import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // 1️⃣ Find logged-in user via email
    const me = await User.findOne({ email: session.user.email }).select("_id");

    if (!me) {
      return NextResponse.json({ users: [] }, { status: 200 });
    }

    // 2️⃣ Fetch all users except me (by _id)
    const users = await User.find({ _id: { $ne: me._id } })
      .select("name username avatar status photos email mobile statusLikes");

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("USERS API ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}
