export default function Loading() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-white animate-pulse">
      {/* Description panel skeleton */}
      <div className="w-full lg:w-1/3 xl:w-[450px] shrink-0 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-100 p-5 md:p-6 flex flex-col gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 w-12 bg-blue-100 rounded" />
          <div className="h-4 w-2 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-blue-100 rounded" />
        </div>
        {/* Badge + title */}
        <div className="flex flex-col gap-3 mt-1">
          <div className="h-6 w-14 bg-green-100 rounded-full" />
          <div className="h-7 w-3/4 bg-gray-200 rounded-lg" />
          <div className="h-5 w-full bg-gray-100 rounded" />
          <div className="h-5 w-2/3 bg-gray-100 rounded" />
        </div>
        {/* Divider */}
        <div className="h-px bg-gray-100 mt-2" />
        {/* Content lines */}
        <div className="flex flex-col gap-3 mt-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-100 rounded"
              style={{ width: `${90 - i * 5}%` }}
            />
          ))}
        </div>
      </div>

      {/* IDE panel skeleton */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full bg-[#0d1117]" />
    </div>
  );
}
