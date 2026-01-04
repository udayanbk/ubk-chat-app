import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  const user = await User.findById(params.id).select(
    "name username avatar status photos statusLikes"
  );

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        User not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <div className="text-center">
        <img
          src={user.avatar || "/default_avatar.png"}
          className="w-24 h-24 mx-auto rounded-full border object-cover"
        />

        <h2 className="mt-3 text-xl font-semibold">
          {user.username || user.name}
        </h2>

        <p className="mt-1 text-gray-600">
          {user.status || "No status"}
        </p>

        <h3 className="mt-5 font-semibold">Photos</h3>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {user.photos?.length ? (
            user.photos.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                className="w-full h-24 object-cover rounded"
                alt="profile photo"
              />
            ))
          ) : (
            <p className="col-span-3 text-sm text-gray-500">
              No photos uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
