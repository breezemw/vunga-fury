import type { BrowserCapabilities, ProcessingCapability } from '../../types/browser'

type NavigatorCapabilities = Navigator & { deviceMemory?: number }

export function classifyProcessingCapability(
  capabilities: Pick<
    BrowserCapabilities,
    'deviceMemoryGiB' | 'videoPlayback' | 'webAssembly' | 'webWorkers'
  >,
): ProcessingCapability {
  if (!capabilities.webAssembly || !capabilities.webWorkers) return 'unsupported'
  if (
    !capabilities.videoPlayback ||
    (capabilities.deviceMemoryGiB !== null && capabilities.deviceMemoryGiB <= 2)
  )
    return 'limited'
  return 'full'
}

export function detectBrowserCapabilities(): BrowserCapabilities {
  const video = document.createElement('video')
  const navigatorWithCapabilities = navigator as NavigatorCapabilities
  const capabilities = {
    deviceMemoryGiB: navigatorWithCapabilities.deviceMemory ?? null,
    fileSystemAccess: 'showSaveFilePicker' in window,
    indexedDb: 'indexedDB' in window,
    sharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
    storageEstimate: 'storage' in navigator && typeof navigator.storage?.estimate === 'function',
    videoPlayback:
      video.canPlayType('video/mp4') !== '' || video.canPlayType('video/quicktime') !== '',
    webAssembly: typeof WebAssembly !== 'undefined',
    webCodecs: 'VideoDecoder' in window && 'VideoEncoder' in window,
    webWorkers: typeof Worker !== 'undefined',
  }
  return { ...capabilities, mode: classifyProcessingCapability(capabilities) }
}
