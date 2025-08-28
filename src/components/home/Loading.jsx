const Loading = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icon placeholder */}
          <div className="p-2 bg-slate-100 rounded-lg">
            <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {/* Title placeholder */}
            <div className="h-5 bg-slate-200 rounded w-32 animate-pulse"></div>
            {/* Subtitle placeholder */}
            <div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        {/* View Details placeholder */}
        <div className="h-4 bg-slate-100 rounded w-20 animate-pulse"></div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {/* Main stat row */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="h-4 bg-slate-200 rounded w-28 animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded w-8 animate-pulse"></div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="text-center space-y-2">
              <div className="h-6 bg-slate-200 rounded w-8 mx-auto animate-pulse"></div>
              <div className="h-3 bg-slate-100 rounded w-12 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating dots animation */}
      <div className="absolute top-4 right-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

// Alternative: Shimmer Loading Effect
const LoadingWithShimmer = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"></div>

      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <div className="h-6 w-6 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-32"></div>
            <div className="h-4 bg-slate-100 rounded w-24"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-100 rounded w-20"></div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="h-4 bg-slate-200 rounded w-28"></div>
          <div className="h-6 bg-slate-200 rounded w-8"></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="text-center space-y-2">
              <div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div>
              <div className="h-3 bg-slate-100 rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Alternative: Pulse with Icon Animation
const LoadingWithIcon = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Animated spinning icon */}
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="h-6 w-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-100 rounded w-20 animate-pulse"></div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-28"></div>
          <div className="h-6 bg-slate-200 rounded w-8"></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item, index) => (
            <div
              key={item}
              className="text-center space-y-2 animate-pulse"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div>
              <div className="h-3 bg-slate-100 rounded w-12 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-4 text-center">
        <span className="text-sm text-slate-500 animate-pulse">Loading security data...</span>
      </div>
    </div>
  );
};

export default Loading