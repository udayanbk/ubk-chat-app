import { NextApiResponseServerIO } from "@/types/next";
import { initSocket } from "@/lib/socket/socketServer";

export async function GET(req: any) {
  const res = req.nextUrl.searchParams;
  return Response.json({ status: "Socket Server Ready" });
}

export async function POST(req: any) {
  const res = req.nextUrl.searchParams;
  return Response.json({ status: "Socket Server Ready" });
}
