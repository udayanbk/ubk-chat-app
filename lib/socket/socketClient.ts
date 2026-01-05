import { io } from "socket.io-client";

const socket = io("/", {
  path: "/api/socket", // 🔥 MUST MATCH SERVER
  autoConnect: false,
});

export default socket;
