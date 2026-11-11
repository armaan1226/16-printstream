export interface PrintStation {
  id: string
  name: string
  location: string
  campusZone: 'COS' | 'Library' | 'Hostels' | 'Academic Block'
  status: 'online' | 'busy' | 'maintenance'
  queueLength: number
  avgWaitMins: number
  supportedFormats: string[]
  paperLevel: number // percentage
  tonerLevel: number // percentage
  colorSupported: boolean
  bindingAvailable: boolean
  printerModel: string
  speedPpm: number
  distanceMeters: number
}

export interface PrintJob {
  id: string
  fileName: string
  fileSizeMb: number
  pageCount: number
  copies: number
  colorMode: 'bw' | 'color'
  duplex: boolean
  paperType: '75gsm' | '85gsm_bond' | '120gsm_glossy'
  binding: 'none' | 'staple' | 'spiral' | 'hardbound'
  pageRange: string
  computedSheets: number
  totalCost: number
  paperSavedSheets: number
  stationId: string
  stationName: string
  status: 'spooling' | 'queued' | 'printing' | 'ready_for_pickup' | 'collected'
  pin: string
  createdAt: string
  pickupExpiresAt: string
}

export interface PaperSavingsStats {
  totalSheetsPrinted: number
  duplexSheetsSaved: number
  co2OffsetKg: number
  waterSavedLiters: number
  treesSaved: number
  recycledPercent: number
}
