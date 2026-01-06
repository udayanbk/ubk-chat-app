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
    <div className="h-full flex bg-background  relative">
      {users}
      {chat}
      {modal}
    </div>
  );
}
