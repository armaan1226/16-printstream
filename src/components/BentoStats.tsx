import { Printer, Zap, Leaf, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react'

interface BentoStatsProps {
  totalJobsCount: number
  sheetsSaved: number
  avgWaitMins: number
  activeStationsCount: number
}

export function BentoStats({
  totalJobsCount,
  sheetsSaved,
  avgWaitMins,
  activeStationsCount,
}: BentoStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Tile 1: Cloud Stations */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Active Stations</span>
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {activeStationsCount} / 5
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
            Ready
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          COS #1, Library Ricoh, CSED & Hostel M online
        </p>
      </div>

      {/* Tile 2: Avg Pickup Wait */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Avg. Pickup Wait</span>
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {avgWaitMins.toFixed(1)} mins
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            -82% vs physical line
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Direct tray dispatch with 6-digit PIN release
        </p>
      </div>

      {/* Tile 3: Duplex Paper Savings */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Campus Paper Saved</span>
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {sheetsSaved.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            sheets
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Auto-duplex algorithm saved ~72.5 kg CO₂
        </p>
      </div>

      {/* Tile 4: Print Jobs Processed */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>Cloud Jobs Streamed</span>
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Zap className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {totalJobsCount}
          </span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
            Active today
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          AES-256 spool encryption & auto-purge
        </p>
      </div>
    </div>
  )
}
