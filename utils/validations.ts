import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  username: z.string().min(3, "Username too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().min(10, "Invalid mobile number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Invalid password"),
});
