export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="mb-12">
        <div className="h-9 w-52 bg-gray-200 rounded-xl mb-3" />
        <div className="h-5 w-80 bg-gray-100 rounded-lg" />
      </div>

      {/* Challenge list skeleton */}
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 bg-white border-[1.5px] border-gray-100 rounded-2xl"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-5 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
