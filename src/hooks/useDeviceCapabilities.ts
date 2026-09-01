import { useState } from 'react'
import { detectBrowserCapabilities } from '../lib/browser/capabilityDetection'

export function useDeviceCapabilities() {
  return useState(detectBrowserCapabilities)[0]
}
