export default function Loading() {
  return (
    <div className="px-6 py-20 max-w-7xl mx-auto w-full animate-pulse">
      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-4 mb-16">
        <div className="h-6 w-40 bg-gray-100 rounded-full" />
        <div className="h-12 w-2/3 bg-gray-100 rounded-xl" />
        <div className="h-6 w-1/2 bg-gray-100 rounded-lg" />
        <div className="flex gap-3 mt-2">
          <div className="h-10 w-32 bg-blue-100 rounded-[10px]" />
          <div className="h-10 w-32 bg-gray-100 rounded-[10px]" />
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-10 w-16 bg-blue-100 rounded-lg" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
