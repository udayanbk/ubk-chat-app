import { Server as NetServer } from "http";
import { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";

interface SocketServer extends NetServer {
  io?: IOServer;
}

export function initSocket(res: NextApiResponse) {
  const server = res.socket.server as SocketServer;

  if (!server.io) {
    console.log("🔥 Initializing Socket.io server...");

    const io = new IOServer(server, {
      path: "/api/socket/io",
      cors: {
        origin: "*", // allow frontend
      },
    });

    server.io = io;

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);

      // socket.on("join", (email) => {
      //   console.log("JOIN ROOM:", email);
      //   socket.join(email);
      // });

      // socket.on("join", (userId: string) => {
      //   socket.join(userId);
      // });

      socket.on("send-message", (msg) => {
        const { receiverId } = msg;
        io.to(receiverId).emit("receive-message", msg);
      });

      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
      });

      // socket.on("status-like-updated", (payload) => {
      //   socket.broadcast.emit("status-like-updated", payload);
      // });

      socket.on("status-like-updated", ({ email }) => {
        // notify ALL tabs listening for this profile
        io.to(email).emit("profile-updated");
      });

    });
  }
}
