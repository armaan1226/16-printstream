import { useState } from 'react'
import {
  Printer,
  MapPin,
  Clock,
  Gauge,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react'
import { PrintStation } from '../types'

interface StationDirectoryProps {
  stations: PrintStation[]
  onSelectStation: (stationId: string) => void
}

export function StationDirectory({ stations, onSelectStation }: StationDirectoryProps) {
  const [filterZone, setFilterZone] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStations = stations.filter((station) => {
    const matchesZone = filterZone === 'all' || station.campusZone === filterZone
    const matchesSearch =
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.printerModel.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesZone && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search and Zone Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search stations, models, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Zone Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'COS', 'Library', 'Academic Block', 'Hostels'].map((zone) => (
            <button
              key={zone}
              onClick={() => setFilterZone(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterZone === zone
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {zone === 'all' ? 'All Zones' : zone}
            </button>
          ))}
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {station.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {station.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${
                    station.status === 'online'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {station.status}
                </span>
              </div>

              {/* Hardware Spec */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 mb-3 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Model:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 truncate ml-2">
                    {station.printerModel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mt-1">
                  <span className="font-medium">Engine Speed:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {station.speedPpm} PPM
                  </span>
                </div>
              </div>

              {/* Telemetry Meters (Paper & Toner) */}
              <div className="space-y-2 mb-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Paper Tray Capacity</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {station.paperLevel}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        station.paperLevel > 40 ? 'bg-indigo-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${station.paperLevel}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Toner Drum Life</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {station.tonerLevel}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${station.tonerLevel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Supported Features Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {station.supportedFormats.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with Distance, Queue & Action */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="text-slate-900 dark:text-white font-bold">
                  {station.queueLength}
                </span>{' '}
                in queue (~{station.avgWaitMins}m)
              </div>

              <button
                onClick={() => onSelectStation(station.id)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors"
              >
                Select Station
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
