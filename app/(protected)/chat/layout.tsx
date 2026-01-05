export default function ChatLayout({
  users,
  chat,
  modal,
}: {
  users: React.ReactNode;
  chat: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 relative">
      {users}
      {chat}
      {modal}
    </div>
  );
}
