export const SUPPORTED_VIDEO_EXTENSIONS = ['mp4', 'mov'] as const
export const SUPPORTED_VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime'] as const
export const MAX_VIDEO_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024
export const MAX_CONTAINER_INSPECTION_BYTES = 32 * 1024 * 1024
export const CONTAINER_READ_CHUNK_BYTES = 4 * 1024 * 1024
export const LARGE_VIDEO_WARNING_BYTES = 500 * 1024 * 1024
export const LOW_END_DEVICE_WARNING_BYTES = 100 * 1024 * 1024

export const VERTICAL_SOCIAL_VIDEO_PROFILE = {
  audioBitrate: '192k',
  maxHeight: 1920,
  maxWidth: 1080,
  name: 'Vertical social video',
  videoCrf: 20,
  videoPreset: 'medium',
} as const
