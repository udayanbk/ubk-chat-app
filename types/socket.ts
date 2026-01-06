import { ChatMessage } from "./chatMessage";

export interface ServerToClientEvents {
  "receive-message": (message: ChatMessage) => void;
  "profile-updated": () => void;
}

export interface ClientToServerEvents {
  join: (email: string) => void;
  "send-message": (message: ChatMessage) => void;
}
