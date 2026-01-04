"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-red-600 font-semibold">Something went wrong</h2>
      <p className="text-sm mt-2">{error.message}</p>
    </div>
  );
}
