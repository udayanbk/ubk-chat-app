import UserListClient from "./UserListClient";

async function getUsers() {
  // ⏳ artificial delay for Suspense demo
  await new Promise((r) => setTimeout(r, 1500));

  const res = await fetch("/api/users", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load users");
  }

  return res.json();
}

export default async function UserList() {
  const data = await getUsers();
  return <UserListClient users={data.users} />;
}
