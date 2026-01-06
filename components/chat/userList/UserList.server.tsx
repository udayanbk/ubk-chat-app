// import { cookies } from "next/headers";
import UserListClient from "./UserListClient";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getUsers() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const me = await User.findOne({ email: session.user.email }).select("_id");
  if (!me) return [];

  const users = await User.find({ _id: { $ne: me._id } })
    .select("name username avatar status photos mobile email");

  return users;
}

export default async function UserList() {
  const users = await getUsers();

  return <UserListClient users={users} />;
}
