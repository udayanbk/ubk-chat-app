import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "./mongoClient";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import User from "./models/User";
import { connectDB } from "./db";
import { LoginCredentials } from "@/types/auth";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: LoginCredentials | null) {
        await connectDB();

        const user = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new Error("User not found");

        const isValid = await compare(
          credentials!.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        // ✅ return minimal safe object
        return {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // ❌ DO NOT create user manually
      // Adapter already handles OAuth users
      return true;
    },

    async jwt({ token, user }) {
      // 🔹 First login (credentials)
      if (user?._id) {
        token._id = user._id;
        token.username = user.username;
        token.avatar = user.avatar;
      }

      // 🔹 OAuth login (Google/GitHub)
      if (!token._id && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).select(
            "_id username avatar"
          );

          if (dbUser) {
            token._id = dbUser._id.toString();
            token.username = dbUser.username;
            token.avatar = dbUser.avatar;
          }
        } catch (err) {
          console.error("JWT callback error:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token._id) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
