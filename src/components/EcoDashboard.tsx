import { Leaf, Droplets, Trees, CloudRain, Award, TrendingUp } from 'lucide-react'
import { PaperSavingsStats } from '../types'

interface EcoDashboardProps {
  stats: PaperSavingsStats
  personalSavedSheets: number
}

export function EcoDashboard({ stats, personalSavedSheets }: EcoDashboardProps) {
  const personalCo2 = Math.round(personalSavedSheets * 0.0084 * 100) / 100
  const personalWater = Math.round(personalSavedSheets * 0.1 * 10) / 10

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm">
        <div className="flex items-center gap-2 text-emerald-200 text-xs font-mono uppercase tracking-wider mb-2">
          <Leaf className="w-4 h-4 text-emerald-300" />
          TIET Sustainable Campus Mission
        </div>
        <h3 className="text-2xl font-bold">Paper & Carbon Savings Tracker</h3>
        <p className="text-emerald-100/90 text-xs max-w-xl mt-1 leading-relaxed">
          Through intelligent default duplexing, electronic proofing, and cloud spool optimization,
          TIET students and faculty have conserved thousands of sheets and reduced collegiate carbon footprints.
        </p>
      </div>

      {/* Grid of Campus Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Duplex Sheets Saved</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.duplexSheetsSaved.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            58.3% of all print jobs opted for double-sided
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>CO₂ Emission Offset</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CloudRain className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.co2OffsetKg} kg
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Equivalent to 310 km driven in an average petrol car
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Water Conserved</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Droplets className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.waterSavedLiters} L
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Industrial pulping water spared from campus rivers
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Trees Preserved</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Trees className="w-4 h-4" />
            </span>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
            {stats.treesSaved.toFixed(2)} Trees
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Calculated via standard Forest Stewardship formulas
          </p>
        </div>
      </div>

      {/* Personal Contribution Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" />
          Your Student Eco-Score
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Sheets You Saved</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {personalSavedSheets} sheets
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Your CO₂ Abatement</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {personalCo2} kg
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400 block mb-1">Water Preserved</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {personalWater} Liters
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
