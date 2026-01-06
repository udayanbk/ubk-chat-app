import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { ChatMessage } from "@/types/chatMessage";


// type ChatUser = {
//   _id: string;
//   name: string;
//   username?: string;
//   avatar?: string;
// };

// type ChatMessage = {
//   _id?: string;
//   sender: string;
//   receiver: string;
//   message: string;
//   mediaUrl?: string;
//   mediaType?: string;
//   createdAt?: string;
// };

interface ChatState {
  selectedUser: User | null;
  messages: ChatMessage[];
  onlineUsers: string[];
}

const initialState: ChatState = {
  selectedUser: null,
  messages: [],
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<ChatUser | null>) => {
      state.selectedUser = action.payload;
    },

    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },

    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },

    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  setSelectedUser,
  setMessages,
  addMessage,
  setOnlineUsers,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
