"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="p-4 text-sm text-red-600">
      Failed to load users
      <button onClick={reset} className="block underline mt-2">
        Retry
      </button>
    </div>
  );
}
