// app/(protected)/chat/loading.tsx
export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Left sidebar skeleton */}
      <div className="w-72 border-r bg-white p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 bg-gray-100 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Chat window skeleton */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1/2 h-10 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>

        <div className="h-12 bg-gray-200 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}
