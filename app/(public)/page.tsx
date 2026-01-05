import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if(session) redirect("/chat");

  return (
    <div className="min-h-screen p-6 text-center bg-ubk-chat">
      <h1 className="text-2xl font-bold">Welcome to UBK Chat</h1>
      <p className="mt-2 text-gray-600">Please login or register to continue.</p>
      <div className="flex flex-row items-center justify-center gap-5 m-5">
        <Button 
          variant="success" 
          size="lg"
        >
          <Link href="/login">Login</Link>
        </Button>

        <Button 
          size="lg"
        >
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </div>
  );
}
