import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if(session) redirect("/chat");

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Welcome to UBK Chat</h1>
      <p className="mt-2 text-gray-600">Please login or register to continue.</p>
    </div>
  );
}
