import { Printer, Sparkles, Moon, Sun, ShieldCheck, Wallet } from 'lucide-react'

interface NavbarProps {
  activeTab: 'create' | 'stations' | 'queue' | 'eco'
  setActiveTab: (tab: 'create' | 'stations' | 'queue' | 'eco') => void
  isDark: boolean
  toggleDark: () => void
  balance: number
  activeJobsCount: number
  onTopUp?: (amount: number) => void
}

export function Navbar({
  activeTab,
  setActiveTab,
  isDark,
  toggleDark,
  balance,
  activeJobsCount,
  onTopUp,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  PrintStream
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  COS & Library Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                TIET Patiala Distributed Zero-Queue Cloud Print Station
              </p>
            </div>
          </div>

          {/* Tab Navigation Switcher */}
          <nav className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              New Print Job
            </button>
            <button
              onClick={() => setActiveTab('stations')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'stations'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Campus Stations (5)
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'queue'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Live Queue & PINs
              {activeJobsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-mono">
                  {activeJobsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('eco')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'eco'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Eco Savings
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Student Wallet */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <Wallet className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Credits:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                ₹{balance.toFixed(2)}
              </span>
              {onTopUp && (
                <button
                  onClick={() => onTopUp(50)}
                  title="Top up ₹50 credits"
                  className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  +₹50
                </button>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-200/60 dark:border-slate-800/60">
          {(['create', 'stations', 'queue', 'eco'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab === 'create' && 'New Print'}
              {tab === 'stations' && 'Stations'}
              {tab === 'queue' && `Queue (${activeJobsCount})`}
              {tab === 'eco' && 'Eco Tracker'}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
