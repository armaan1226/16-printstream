import { useState } from 'react'
import {
  X,
  Printer,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  Download,
  AlertTriangle,
} from 'lucide-react'
import { PrintJob } from '../types'

interface PickupPassModalProps {
  job: PrintJob | null
  onClose: () => void
  onClaimJob: (jobId: string) => void
}

export function PickupPassModal({ job, onClose, onClaimJob }: PickupPassModalProps) {
  const [copied, setCopied] = useState(false)

  if (!job) return null

  const handleCopyPin = () => {
    navigator.clipboard?.writeText(job.pin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-mono uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Verified Cloud Pickup Pass
          </div>
          <h3 className="text-xl font-bold">{job.stationName}</h3>
          <p className="text-xs text-indigo-100/80 mt-1">
            Show this PIN at the touch console or scan barcode
          </p>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-6">
          {/* Large PIN Display */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center relative group">
            <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
              6-Digit Secure Release PIN
            </span>
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="font-mono font-extrabold text-3xl tracking-widest text-indigo-600 dark:text-indigo-400">
                {job.pin}
              </span>
              <button
                onClick={handleCopyPin}
                className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                title="Copy PIN"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Auto-expires in 24 hours ({job.pickupExpiresAt})
            </span>
          </div>

          {/* Mock Barcode / QR Simulation */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            {/* SVG Barcode simulation */}
            <div className="flex items-center justify-center gap-1 h-12 w-full max-w-xs mb-2">
              {[4, 2, 6, 2, 4, 1, 8, 3, 2, 5, 2, 6, 3, 2, 7, 1, 3, 5, 2, 8, 4, 2].map((w, i) => (
                <div
                  key={i}
                  className="bg-slate-800 dark:bg-slate-200 h-full rounded-[1px]"
                  style={{ width: `${w * 2.5}px` }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              *TIET-{job.id}-{job.pin.replace('-', '')}*
            </span>
          </div>

          {/* Job summary specs */}
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Document:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[200px]">
                {job.fileName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pages & Sides:</span>
              <span>
                {job.pageCount} pgs • {job.duplex ? 'Double-sided' : 'Single'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Binding:</span>
              <span className="uppercase text-indigo-600 dark:text-indigo-400">
                {job.binding}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Total Paid:</span>
              <span>₹{job.totalCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Kiosk Scan simulation button */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onClaimJob(job.id)
                onClose()
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Simulate Kiosk PIN Scan & Collect Print
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Close Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
