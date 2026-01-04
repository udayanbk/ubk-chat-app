import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, username, email, password, mobile } = body;

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashed = await hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashed,
      mobile,
      status: "",
      avatar: "/default_avatar.png",
      photos: [],
      likes: [],
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
