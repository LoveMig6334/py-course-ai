export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 pb-20 w-full animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-12 bg-blue-100 rounded" />
        <div className="h-4 w-2 bg-gray-100 rounded" />
        <div className="h-4 w-16 bg-blue-100 rounded" />
        <div className="h-4 w-2 bg-gray-100 rounded" />
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
      </div>

      {/* Header skeleton */}
      <div className="mb-10 pb-8 border-b border-gray-100">
        <div className="h-9 w-3/4 bg-gray-200 rounded-xl mb-3" />
        <div className="h-5 w-1/2 bg-gray-100 rounded-lg" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-100 rounded"
            style={{ width: `${85 - i * 5}%` }}
          />
        ))}
        <div className="h-32 bg-gray-50 rounded-xl border border-gray-100 mt-4" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i + 10}
            className="h-4 bg-gray-100 rounded"
            style={{ width: `${90 - i * 8}%` }}
          />
        ))}
      </div>
    </div>
  );
}
