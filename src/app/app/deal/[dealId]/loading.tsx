export default function DealLoading() {
  return (
    <div className="animate-pulse">
      {/* Score hero */}
      <div className="bg-white border-b border-line px-5 sm:px-8 py-6 -mx-5 sm:-mx-8 -mt-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <div className="w-24 h-24 rounded-full bg-surface-2 mx-auto sm:mx-0 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-7 w-48 bg-line-2 rounded-lg mb-2" />
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-20 bg-surface-2 rounded-full" />
              <div className="h-5 w-16 bg-surface-2 rounded-full" />
            </div>
            <div className="h-4 w-full max-w-sm bg-surface-2 rounded" />
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 -mx-5 sm:-mx-8 px-5 sm:px-8 overflow-x-auto border-b border-line pb-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-24 flex-shrink-0 bg-surface-2 rounded-t-lg" />
        ))}
      </div>

      {/* Content panels */}
      <div className="space-y-4">
        <div className="bg-white rounded-[14px] border border-line-2 h-40" />
        <div className="bg-white rounded-[14px] border border-line-2 h-56" />
        <div className="bg-white rounded-[14px] border border-line-2 h-32" />
      </div>
    </div>
  )
}
