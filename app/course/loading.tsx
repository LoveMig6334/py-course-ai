export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="h-9 w-52 bg-gray-200 rounded-xl mb-3" />
        <div className="h-5 w-72 bg-gray-100 rounded-lg" />
      </div>

      {/* Course cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white border-[1.5px] border-gray-100 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="h-6 w-28 bg-blue-100 rounded-full" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
            <div className="p-3 flex flex-col gap-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-4 p-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0" />
                  <div className="h-4 flex-1 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
