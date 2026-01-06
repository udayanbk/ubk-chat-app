export interface ChatMessage {
  _id: string;
  message: string;
  senderId: string;
  senderEmail: string;
  receiverId: string;
  receiverEmail: string;
  createdAt: string;
}
