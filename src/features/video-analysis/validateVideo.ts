import {
  LARGE_VIDEO_WARNING_BYTES,
  MAX_VIDEO_FILE_SIZE_BYTES,
  LOW_END_DEVICE_WARNING_BYTES,
  SUPPORTED_VIDEO_EXTENSIONS,
  SUPPORTED_VIDEO_MIME_TYPES,
} from '../../config/videoConfig'
import type { FileValidationResult } from './videoTypes'

type FileDescriptor = Pick<File, 'name' | 'size' | 'type'>

export function getFileExtension(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension ?? ''
}

export function validateVideoDescriptor(file: FileDescriptor): FileValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const extension = getFileExtension(file.name)

  if (
    !SUPPORTED_VIDEO_EXTENSIONS.includes(extension as (typeof SUPPORTED_VIDEO_EXTENSIONS)[number])
  ) {
    errors.push('Choose an MP4 or MOV video file.')
  }

  if (
    file.type &&
    !SUPPORTED_VIDEO_MIME_TYPES.includes(file.type as (typeof SUPPORTED_VIDEO_MIME_TYPES)[number])
  ) {
    errors.push('This file does not report a supported video MIME type.')
  }

  if (!file.type) {
    warnings.push(
      'The browser did not provide a MIME type. The video stream will be checked before use.',
    )
  }

  if (file.size === 0) {
    errors.push('This file is empty.')
  }

  if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
    errors.push('This file exceeds the 2 GB local processing limit.')
  }

  if (file.size >= LARGE_VIDEO_WARNING_BYTES) {
    warnings.push(
      'This large video may require significant memory. Keep this tab open and avoid running other heavy apps while processing.',
    )
  }

  if (!('URL' in window) || !URL.createObjectURL || !('HTMLVideoElement' in window)) {
    errors.push('Your browser does not provide the local video APIs required for preview.')
  }

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (deviceMemory !== undefined && deviceMemory <= 2 && file.size > LOW_END_DEVICE_WARNING_BYTES) {
    warnings.push(
      'This video may require significant memory on this device. Analysis may take longer.',
    )
  }

  return { errors, warnings }
}
