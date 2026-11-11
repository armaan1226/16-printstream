import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { BentoStats } from './components/BentoStats'
import { UploadAndConfig } from './components/UploadAndConfig'
import { StationDirectory } from './components/StationDirectory'
import { QueueTracker } from './components/QueueTracker'
import { PickupPassModal } from './components/PickupPassModal'
import { EcoDashboard } from './components/EcoDashboard'
import {
  INITIAL_STATIONS,
  INITIAL_JOBS,
  CAMPUS_SAVINGS,
} from './data/mockData'
import { PrintStation, PrintJob } from './types'

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'stations' | 'queue' | 'eco'>('create')
  const [stations, setStations] = useState<PrintStation[]>(INITIAL_STATIONS)
  const [selectedStationId, setSelectedStationId] = useState<string>(INITIAL_STATIONS[0]?.id || '')
  const [jobs, setJobs] = useState<PrintJob[]>(INITIAL_JOBS)
  const [userBalance, setUserBalance] = useState<number>(184.5)
  const [selectedPassJob, setSelectedPassJob] = useState<PrintJob | null>(null)
  const [personalSheetsSaved, setPersonalSheetsSaved] = useState<number>(50)

  // Sync dark class on root document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDark = () => setIsDark((prev) => !prev)

  // Handle new job created
  const handleJobCreated = (newJob: PrintJob) => {
    setUserBalance((prev) => Math.max(0, prev - newJob.totalCost))
    setJobs((prev) => [newJob, ...prev])
    setPersonalSheetsSaved((prev) => prev + newJob.paperSavedSheets)
    // Auto-open the pickup pass for the new job
    setSelectedPassJob(newJob)
    // Switch to queue tab so student sees it
    setActiveTab('queue')
  }

  // Advance job status in simulation
  const handleAdvanceJobStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        let nextStatus: PrintJob['status'] = j.status
        if (j.status === 'spooling') nextStatus = 'queued'
        else if (j.status === 'queued') nextStatus = 'printing'
        else if (j.status === 'printing') nextStatus = 'ready_for_pickup'
        else if (j.status === 'ready_for_pickup') nextStatus = 'collected'
        return { ...j, status: nextStatus }
      })
    )
  }

  // Claim job at kiosk
  const handleClaimJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'collected' } : j))
    )
  }

  // Cancel job
  const handleCancelJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId))
  }

  const activeJobsCount = jobs.filter((j) => j.status !== 'collected').length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={toggleDark}
        balance={userBalance}
        activeJobsCount={activeJobsCount}
        onTopUp={(amt) => setUserBalance((prev) => prev + amt)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bento KPI Summary */}
        <BentoStats
          totalJobsCount={jobs.length}
          sheetsSaved={CAMPUS_SAVINGS.duplexSheetsSaved + personalSheetsSaved}
          avgWaitMins={2.2}
          activeStationsCount={stations.filter((s) => s.status === 'online').length}
        />

        {/* Tab content */}
        {activeTab === 'create' && (
          <UploadAndConfig
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
            onJobCreated={handleJobCreated}
            userBalance={userBalance}
          />
        )}

        {activeTab === 'stations' && (
          <StationDirectory
            stations={stations}
            onSelectStation={(id) => {
              setSelectedStationId(id)
              setActiveTab('create')
            }}
          />
        )}

        {activeTab === 'queue' && (
          <QueueTracker
            jobs={jobs}
            onOpenPass={(job) => setSelectedPassJob(job)}
            onAdvanceJobStatus={handleAdvanceJobStatus}
            onCancelJob={handleCancelJob}
          />
        )}

        {activeTab === 'eco' && (
          <EcoDashboard
            stats={CAMPUS_SAVINGS}
            personalSavedSheets={personalSheetsSaved}
          />
        )}
      </main>

      {/* Pickup Pass Modal */}
      <PickupPassModal
        job={selectedPassJob}
        onClose={() => setSelectedPassJob(null)}
        onClaimJob={handleClaimJob}
      />
    </div>
  )
}
