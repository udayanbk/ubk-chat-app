"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
// import axios from "axios";
import { loginSchema } from "@/utils/validations";
import { z } from "zod";
import { useRouter } from "next/navigation";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData: LoginForm = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      const messages = parsed.error.errors.map(e => e.message);
      setError(messages.join(", "));
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/chat");
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-background p-6 rounded-3xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-3">
        <input name="email" placeholder="Email" className="input rounded-3xl pl-5" />
        <input name="password" type="password" placeholder="Password" className="input rounded-3xl pl-5" />

        <button className="w-full bg-primary text-primary-foreground py-2 rounded-3xl">
          Login
        </button>
      </form>

      <hr className="my-4" />

      <button
        className="w-full bg-red-600 text-primary-foreground py-2 rounded-3xl"
        onClick={() => signIn("google", {
          callbackUrl: "/chat", // added later
        })}
      >
        Continue with Google
      </button>

      <button
        className="w-full bg-gray-800 text-primary-foreground py-2 rounded-3xl mt-2"
        onClick={() => signIn("github")}
      >
        Continue with GitHub
      </button>
    </div>
  );
}
