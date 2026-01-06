export default function UserListSkeleton() {
  return (  
    <div className="w-72 border-r h-full bg-background overflow-y-auto">
      <div className="h-6 w-24 bg-card  dark:bg-slate-800 rounded animate-pulse" />

      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-card  dark:bg-slate-800 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-card  dark:bg-slate-800 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-card  dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-2 bg-gray-100 rounded animate-pulse w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
