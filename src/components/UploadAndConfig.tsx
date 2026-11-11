import { useState, useMemo } from 'react'
import {
  UploadCloud,
  FileText,
  Layers,
  Settings2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Printer,
  Shield,
} from 'lucide-react'
import { PrintStation, PrintJob } from '../types'
import { PRESET_DOCUMENTS } from '../data/mockData'

interface UploadAndConfigProps {
  stations: PrintStation[]
  onJobCreated: (newJob: PrintJob) => void
  userBalance: number
  selectedStationId?: string
  onSelectStation?: (id: string) => void
}

export function UploadAndConfig({
  stations,
  onJobCreated,
  userBalance,
  selectedStationId: propStationId,
  onSelectStation,
}: UploadAndConfigProps) {
  // Document state
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0)
  const [customFileName, setCustomFileName] = useState('')
  const [customPageCount, setCustomPageCount] = useState(12)

  // Configuration state
  const [internalStationId, setInternalStationId] = useState(stations[0]?.id || '')
  const selectedStationId = propStationId || internalStationId
  const setSelectedStationId = (id: string) => {
    setInternalStationId(id)
    onSelectStation?.(id)
  }
  const [colorMode, setColorMode] = useState<'bw' | 'color'>('bw')
  const [duplex, setDuplex] = useState(true)
  const [paperType, setPaperType] = useState<'75gsm' | '85gsm_bond' | '120gsm_glossy'>('75gsm')
  const [binding, setBinding] = useState<'none' | 'staple' | 'spiral' | 'hardbound'>('none')
  const [rangeMode, setRangeMode] = useState<'all' | 'custom' | 'odd' | 'even'>('all')
  const [customRangeText, setCustomRangeText] = useState('1-12')
  const [copies, setCopies] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const activeDoc = PRESET_DOCUMENTS[selectedPresetIndex]
  const currentFileName = customFileName || activeDoc.name
  const totalRawPages = customFileName ? customPageCount : activeDoc.pages

  // Calculate actual printed pages based on range
  const computedPrintPages = useMemo(() => {
    if (rangeMode === 'all') return totalRawPages
    if (rangeMode === 'odd') return Math.ceil(totalRawPages / 2)
    if (rangeMode === 'even') return Math.floor(totalRawPages / 2)
    if (rangeMode === 'custom') {
      try {
        const parts = customRangeText.split('-')
        if (parts.length === 2) {
          const start = parseInt(parts[0], 10)
          const end = parseInt(parts[1], 10)
          if (!isNaN(start) && !isNaN(end) && end >= start) {
            return Math.min(totalRawPages, Math.max(1, end - start + 1))
          }
        }
      } catch {
        return totalRawPages
      }
    }
    return totalRawPages
  }, [rangeMode, customRangeText, totalRawPages])

  // Sheets consumed
  const sheetsNeeded = useMemo(() => {
    if (duplex) {
      return Math.ceil(computedPrintPages / 2) * copies
    }
    return computedPrintPages * copies
  }, [duplex, computedPrintPages, copies])

  // Sheets saved by duplex
  const sheetsSaved = useMemo(() => {
    if (!duplex) return 0
    const simplexSheets = computedPrintPages * copies
    return Math.max(0, simplexSheets - sheetsNeeded)
  }, [duplex, computedPrintPages, copies, sheetsNeeded])

  // Real-time Pricing Calculation
  const costBreakdown = useMemo(() => {
    // Base rate per page
    const basePageRate = colorMode === 'bw' ? 1.5 : 6.0
    // If duplex, ₹0.25 discount per side printed on same sheet
    const perPageCost = duplex && colorMode === 'bw' ? 1.25 : basePageRate

    const pagesSubtotal = computedPrintPages * perPageCost * copies

    // Paper type surcharge per sheet
    let paperSurchargePerSheet = 0
    if (paperType === '85gsm_bond') paperSurchargePerSheet = 0.5
    if (paperType === '120gsm_glossy') paperSurchargePerSheet = 2.0
    const paperSurcharge = sheetsNeeded * paperSurchargePerSheet

    // Binding surcharge
    let bindingFee = 0
    if (binding === 'staple') bindingFee = 2.0 * copies
    if (binding === 'spiral') bindingFee = 25.0 * copies
    if (binding === 'hardbound') bindingFee = 150.0 * copies

    const total = pagesSubtotal + paperSurcharge + bindingFee

    return {
      pagesSubtotal,
      paperSurcharge,
      bindingFee,
      total: Math.round(total * 100) / 100,
    }
  }, [colorMode, duplex, computedPrintPages, copies, paperType, binding, sheetsNeeded])

  const selectedStation = stations.find((s) => s.id === selectedStationId) || stations[0]

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCustomFileName(file.name)
      // Estimate pages roughly based on size (simulated PDF parser)
      const estimatedPages = Math.max(2, Math.min(80, Math.floor(file.size / 65000) + 4))
      setCustomPageCount(estimatedPages)
    }
  }

  const handleSubmitPrint = () => {
    setIsSubmitting(true)

    // Generate random 6-digit PIN format XXX-XXX
    const randomPin = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`
    const randomJobId = `JOB-${Math.floor(1000 + Math.random() * 9000)}`

    setTimeout(() => {
      const newJob: PrintJob = {
        id: randomJobId,
        fileName: currentFileName,
        fileSizeMb: customFileName ? 3.8 : activeDoc.sizeMb,
        pageCount: computedPrintPages,
        copies,
        colorMode,
        duplex,
        paperType,
        binding,
        pageRange: rangeMode === 'all' ? `All (1-${totalRawPages})` : customRangeText,
        computedSheets: sheetsNeeded,
        totalCost: costBreakdown.total,
        paperSavedSheets: sheetsSaved,
        stationId: selectedStation.id,
        stationName: selectedStation.name,
        status: 'spooling',
        pin: randomPin,
        createdAt: 'Just now',
        pickupExpiresAt: 'In 24 hours',
      }

      onJobCreated(newJob)
      setIsSubmitting(false)
      setSuccessToast(`Job ${randomJobId} spooled! Pickup PIN: ${randomPin}`)
      setTimeout(() => setSuccessToast(null), 5000)
    }, 700)
  }

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold text-sm">{successToast}</p>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                Dispatched to {selectedStation.name}. Present PIN or scan QR at the station terminal.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-200 dark:bg-emerald-800 hover:bg-emerald-300"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File upload & selection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Picker Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-indigo-500" />
              1. Select or Upload Document
            </h3>

            {/* Drag & drop upload target */}
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-800/30 cursor-pointer transition-all group">
              <UploadCloud className="w-9 h-9 text-indigo-500 group-hover:scale-110 transition-transform mb-2" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Click to browse PDF / Word document
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automatic page counting & PDF vector preview
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                onChange={handleFileUploadSim}
              />
            </label>

            {/* Preset quick test documents */}
            <div className="mt-4">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Or pick a sample campus document:
              </span>
              <div className="space-y-2">
                {PRESET_DOCUMENTS.map((doc, idx) => (
                  <button
                    key={doc.name}
                    onClick={() => {
                      setSelectedPresetIndex(idx)
                      setCustomFileName('')
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      !customFileName && selectedPresetIndex === idx
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-medium text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-indigo-500 font-mono text-[11px]">PDF</span>
                      <span className="truncate">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      <span>{doc.pages} pgs</span>
                      <span>•</span>
                      <span>{doc.sizeMb} MB</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Telemetry Badge */}
            <div className="mt-4 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                  Detected Pages
                </span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">
                  {totalRawPages} Pages
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">
                  Selected Range
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                  {computedPrintPages} To Print
                </span>
              </div>
            </div>
          </div>

          {/* Target Station Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-indigo-500" />
              2. Target Cloud Station
            </h3>
            <div className="space-y-2">
              {stations.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStationId(st.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedStationId === st.id
                      ? 'border-indigo-500 ring-1 ring-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20'
                      : 'border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {st.name}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase font-mono ${
                        st.status === 'online'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" /> ~{st.avgWaitMins}m wait
                    </span>
                    <span>•</span>
                    <span className="font-mono">{st.distanceMeters}m away</span>
                    <span>•</span>
                    <span>{st.queueLength} in queue</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Print Configuration & Cost Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-indigo-500" />
              3. Print & Finish Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color Mode */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Color Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setColorMode('bw')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      colorMode === 'bw'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>Monochrome (B/W)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      ₹1.50 / page
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode('color')}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      colorMode === 'color'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>Full Vibrant Color</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      ₹6.00 / page
                    </div>
                  </button>
                </div>
              </div>

              {/* Duplex / Sides */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Print Sides
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDuplex(true)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      duplex
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Double-Sided</span>
                      <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1 rounded">
                        -40% Eco
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                      Saves paper & cost
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplex(false)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      !duplex
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>Single-Sided</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      Standard Simplex
                    </div>
                  </button>
                </div>
              </div>

              {/* Paper Weight */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Paper Stock Grade
                </label>
                <select
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="75gsm">Standard 75 GSM (Campus default)</option>
                  <option value="85gsm_bond">Executive Bond 85 GSM (+₹0.50/sheet)</option>
                  <option value="120gsm_glossy">Heavy Project Glossy 120 GSM (+₹2.00/sheet)</option>
                </select>
              </div>

              {/* Binding Options */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Binding & Finishing
                </label>
                <select
                  value={binding}
                  onChange={(e) => setBinding(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="none">Loose Sheets (No Binding)</option>
                  <option value="staple">Corner High-Gauge Staple (+₹2.00)</option>
                  <option value="spiral">Spiral Wire Binding + Clear OHP (+₹25.00)</option>
                  <option value="hardbound">TIET Official Hardbound Golden Foil (+₹150.00)</option>
                </select>
              </div>
            </div>

            {/* Page Range Selection */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Page Selection
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {(['all', 'odd', 'even', 'custom'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setRangeMode(mode)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      rangeMode === mode
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mode === 'all' && `All Pages (${totalRawPages})`}
                    {mode === 'odd' && 'Odd Pages Only'}
                    {mode === 'even' && 'Even Pages Only'}
                    {mode === 'custom' && 'Custom Range'}
                  </button>
                ))}
              </div>
              {rangeMode === 'custom' && (
                <input
                  type="text"
                  value={customRangeText}
                  onChange={(e) => setCustomRangeText(e.target.value)}
                  placeholder="e.g. 1-10, 14-22"
                  className="w-full p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              )}
            </div>

            {/* Copies Slider */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Number of Copies
                </label>
                <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {copies} {copies === 1 ? 'Copy' : 'Copies'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={copies}
                onChange={(e) => setCopies(parseInt(e.target.value, 10))}
                className="w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
              />
            </div>

            {/* Live Real-Time Cost Calculation Receipt */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono">
                <span>
                  Print Fee ({computedPrintPages} pgs × {copies} {copies > 1 ? 'copies' : 'copy'} @ {colorMode === 'bw' ? (duplex ? '₹1.25' : '₹1.50') : '₹6.00'})
                </span>
                <span>₹{costBreakdown.pagesSubtotal.toFixed(2)}</span>
              </div>
              {costBreakdown.paperSurcharge > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono">
                  <span>Paper Stock Surcharge ({sheetsNeeded} sheets)</span>
                  <span>+₹{costBreakdown.paperSurcharge.toFixed(2)}</span>
                </div>
              )}
              {costBreakdown.bindingFee > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-mono">
                  <span>Binding Charge</span>
                  <span>+₹{costBreakdown.bindingFee.toFixed(2)}</span>
                </div>
              )}
              {duplex && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium font-mono text-[11px]">
                  <span>Duplex Eco Savings ({sheetsSaved} sheets saved)</span>
                  <span>-₹{(sheetsSaved * 0.25).toFixed(2)} credited</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-baseline justify-between font-bold">
                <span className="text-slate-900 dark:text-white text-sm">Grand Total</span>
                <span className="font-mono text-xl text-indigo-600 dark:text-indigo-400">
                  ₹{costBreakdown.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                disabled={isSubmitting || userBalance < costBreakdown.total}
                onClick={handleSubmitPrint}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Spooling Document & Securing PIN...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Send to Cloud Queue & Generate PIN Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {userBalance < costBreakdown.total && (
              <p className="mt-2 text-xs text-rose-500 text-center">
                Insufficient wallet balance (₹{userBalance.toFixed(2)}). Please top up via UPI.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
