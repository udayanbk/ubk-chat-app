import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {

    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {

      socket.on("join", (email: string) => {
        console.log("JOIN ROOM:", email);
        socket.join(email);
      });

      socket.on("send-message", (msg) => {
        io.to(msg.receiverEmail).emit("receive-message", msg);
      });
    });
  }

  res.end();
}
