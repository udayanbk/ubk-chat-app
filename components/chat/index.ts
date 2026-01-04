import dynamic from "next/dynamic";

export const UserList = dynamic(() => import("./UserList"), {
  suspense: true,
});

export const ChatWindow = dynamic(() => import("./ChatWindow"), {
  suspense: true,
});
