"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";
import { loginSchema } from "@/utils/validations";
import { z } from "zod";
import { useRouter } from "next/navigation";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setError("");

    const formData: LoginForm = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const parsed = loginSchema.safeParse(formData);
    if (!parsed.success) {
      setError(
        parsed.error.issues?.[0]?.message ?? "Invalid email or password"
      );
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
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-3">
        <input name="email" placeholder="Email" className="input" />
        <input name="password" type="password" placeholder="Password" className="input" />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>

      <hr className="my-4" />

      <button
        className="w-full bg-red-600 text-white py-2 rounded"
        onClick={() => signIn("google", {
          callbackUrl: "/chat", // added later
        })}
      >
        Continue with Google
      </button>

      <button
        className="w-full bg-gray-800 text-white py-2 rounded mt-2"
        onClick={() => signIn("github")}
      >
        Continue with GitHub
      </button>
    </div>
  );
}
