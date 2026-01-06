import Image from "next/image";
import { cookies } from "next/headers";

// async function getUsers() {
//   const cookieStore = cookies();
//   const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users`, {
//     // Server fetch with cache
//     next: { revalidate: 60 }, // ISR: revalidate every 60s
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch users");
//   }
//   const users = await res.json();
//   console.log("public users", users)
//   return users;
// }

async function getUsers() {
  const cookieStore = cookies();

  const res = await fetch("http://localhost:3000/api/users", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  return res.json();
}


export const metadata = {
  title: "Users | UBK Chat",
  description: "Public users list rendered using Server Components",
};

export default async function UsersPage() {
  const { users } = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Public Users (Server Component)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u: any) => (
          <div
            key={u._id}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-3"
          >
            <Image
              src={u.avatar || "/default_avatar.png"}
              alt="avatar"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="font-medium truncate">
                {u.username || u.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {u.status || "Hi, I'm on UBK Chat"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
