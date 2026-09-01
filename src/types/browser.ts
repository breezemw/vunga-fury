export type ProcessingCapability = 'full' | 'limited' | 'unsupported'

export type BrowserCapabilities = {
  deviceMemoryGiB: number | null
  fileSystemAccess: boolean
  indexedDb: boolean
  mode: ProcessingCapability
  sharedArrayBuffer: boolean
  storageEstimate: boolean
  videoPlayback: boolean
  webAssembly: boolean
  webCodecs: boolean
  webWorkers: boolean
}
