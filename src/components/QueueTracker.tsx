import { useState, useEffect } from 'react'
import {
  Clock,
  Printer,
  CheckCircle,
  QrCode,
  ShieldAlert,
  ArrowRight,
  RotateCw,
  ExternalLink,
  KeyRound,
  FileCheck,
} from 'lucide-react'
import { PrintJob } from '../types'

interface QueueTrackerProps {
  jobs: PrintJob[]
  onOpenPass: (job: PrintJob) => void
  onAdvanceJobStatus: (jobId: string) => void
  onCancelJob: (jobId: string) => void
}

export function QueueTracker({
  jobs,
  onOpenPass,
  onAdvanceJobStatus,
  onCancelJob,
}: QueueTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const filteredJobs = jobs.filter((j) => {
    if (filter === 'active') return j.status !== 'collected'
    if (filter === 'completed') return j.status === 'collected'
    return true
  })

  const getStatusBadge = (status: PrintJob['status']) => {
    switch (status) {
      case 'spooling':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <RotateCw className="w-2.5 h-2.5 animate-spin" /> Spooling AES
          </span>
        )
      case 'queued':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            In Station Queue
          </span>
        )
      case 'printing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
            Printing Now
          </span>
        )
      case 'ready_for_pickup':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Ready at Counter
          </span>
        )
      case 'collected':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            Collected
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-indigo-500" />
            Live Cloud Spool & Pickup PIN Passboard
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Present your 6-digit PIN or scan QR barcode at any Xerox/Ricoh cloud kiosk to release
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'active'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Active & Ready
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Jobs list */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
          <FileCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">No Print Jobs Found</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Send a new document from the 'New Print Job' tab to generate a secure pickup PIN.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* File info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {job.id}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    {getStatusBadge(job.status)}
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {job.createdAt}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {job.fileName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {job.stationName}
                    </span>
                    <span>•</span>
                    <span>{job.pageCount} pgs ({job.computedSheets} sheets)</span>
                    <span>•</span>
                    <span className="capitalize">{job.colorMode === 'bw' ? 'B/W' : 'Color'}</span>
                    <span>•</span>
                    <span>{job.duplex ? 'Duplex' : 'Simplex'}</span>
                    {job.binding !== 'none' && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {job.binding.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 6-Digit PIN Banner & Action */}
                <div className="flex items-center gap-3">
                  {/* PIN Display */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center min-w-[130px]">
                    <span className="block text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
                      Pickup PIN
                    </span>
                    <span className="font-mono font-bold text-lg tracking-wider text-indigo-600 dark:text-indigo-400">
                      {job.pin}
                    </span>
                  </div>

                  {/* Open Pass Button */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => onOpenPass(job)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Digital Pass</span>
                    </button>

                    {job.status !== 'collected' && (
                      <button
                        onClick={() => onAdvanceJobStatus(job.id)}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition-colors"
                      >
                        Simulate Step ➔
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Active Jobs */}
              {job.status !== 'collected' && (
                <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>Dispatch Pipeline</span>
                    <span>
                      {job.status === 'spooling' && 'Spooling to Encrypted Buffer (25%)'}
                      {job.status === 'queued' && 'Waiting for Physical Drum (50%)'}
                      {job.status === 'printing' && 'Laser Rasterization in Progress (75%)'}
                      {job.status === 'ready_for_pickup' && 'Ready in Output Bin #3 (100%)'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        job.status === 'ready_for_pickup'
                          ? 'bg-emerald-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{
                        width:
                          job.status === 'spooling'
                            ? '25%'
                            : job.status === 'queued'
                            ? '50%'
                            : job.status === 'printing'
                            ? '75%'
                            : '100%',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
