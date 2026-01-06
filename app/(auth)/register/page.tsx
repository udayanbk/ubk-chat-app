"use client";

import { useState } from "react";
import { registerSchema } from "@/utils/validations";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    const formData: RegisterForm = {
      name: e.target.name.value,
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      mobile: e.target.mobile.value,
    };

    // Validate in frontend also
    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMsg = JSON.parse(parsed?.error?.message);
      console.log("errorMsg", errorMsg)
      toast({
        variant: "error",
        title: "Validation error",
        description: errorMsg?.[0]?.message,
      });
    
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/register", formData);
      if (res.status === 201) {
        router.push("/login?registered=1");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Cannot register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-background p-6 rounded-3xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full Name" className="input rounded-3xl pl-5" />
        <input name="username" placeholder="Username" className="input rounded-3xl pl-5" />
        <input name="email" placeholder="Email" className="input rounded-3xl pl-5" />
        <input name="mobile" placeholder="Mobile" className="input rounded-3xl pl-5" />
        <input name="password" type="password" placeholder="Password" className="input rounded-3xl pl-5" />

        <button
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-3xl pl-5"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
