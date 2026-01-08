import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/chat");
  }

  return <div className="bg-ubk-chat min-h-screen flex items-start justify justify-center">{children}</div>;
}
