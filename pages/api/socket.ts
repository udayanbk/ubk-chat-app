import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    console.log("🔥 Initializing Socket.IO server");

    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 Connected:", socket.id);

      socket.on("join", (email: string) => {
        console.log("JOIN ROOM:", email);
        socket.join(email);
      });

      socket.on("send-message", (msg) => {
        console.log("📨 Emitting to:", msg.receiverEmail);
        io.to(msg.receiverEmail).emit("receive-message", msg);
      });
    });
  }

  res.end();
}
