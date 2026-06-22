export default function DealLoading() {
  return (
    <div className="animate-pulse">
      {/* Score hero */}
      <div className="bg-white border-b border-slate-200 px-5 sm:px-8 py-6 -mx-5 sm:-mx-8 -mt-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto sm:mx-0 flex-shrink-0" />
          <div className="flex-1">
            <div className="h-7 w-48 bg-slate-200 rounded-lg mb-2" />
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-20 bg-slate-100 rounded-full" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="h-4 w-full max-w-sm bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 -mx-5 sm:-mx-8 px-5 sm:px-8 overflow-x-auto border-b border-slate-200 pb-0">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-24 flex-shrink-0 bg-slate-100 rounded-t-lg" />
        ))}
      </div>

      {/* Content panels */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 h-40" />
        <div className="bg-white rounded-2xl border border-slate-100 h-56" />
        <div className="bg-white rounded-2xl border border-slate-100 h-32" />
      </div>
    </div>
  )
}
