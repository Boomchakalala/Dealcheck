export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="h-7 w-28 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-52 bg-slate-100 rounded" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="h-10 w-64 bg-slate-100 rounded-xl" />
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-3 h-[90px]" />
        ))}
      </div>

      {/* Recent deals table */}
      <div className="bg-white rounded-2xl border border-slate-100 mb-4">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between">
          <div className="h-5 w-28 bg-slate-200 rounded" />
          <div className="h-5 w-16 bg-slate-100 rounded" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="px-5 py-4 border-b border-slate-50 last:border-0 flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-36 bg-slate-200 rounded mb-1.5" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Two chart panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 h-44" />
        <div className="bg-white rounded-2xl border border-slate-100 h-44" />
      </div>
    </div>
  )
}
