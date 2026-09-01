import {
  CONTAINER_READ_CHUNK_BYTES,
  MAX_CONTAINER_INSPECTION_BYTES,
} from '../../config/videoConfig'
import type { MP4BoxBuffer, Movie, Track } from 'mp4box'
import type { ContainerMetadata } from './videoTypes'

function formatCodec(codec: string | undefined) {
  if (!codec) return null
  const normalized = codec.toLowerCase()
  if (normalized.startsWith('avc1')) return `H.264 (${codec})`
  if (normalized.startsWith('hvc1') || normalized.startsWith('hev1')) return `HEVC (${codec})`
  if (normalized.startsWith('av01')) return `AV1 (${codec})`
  if (normalized.startsWith('vp09')) return `VP9 (${codec})`
  if (normalized.startsWith('mp4a.6b')) return `MP3 (${codec})`
  if (normalized.startsWith('mp4a')) return `AAC (${codec})`
  return codec
}

function getAverageFrameRate(track: Track | undefined) {
  if (!track || track.duration <= 0 || track.timescale <= 0 || track.nb_samples <= 0) return null
  const durationSeconds = track.duration / track.timescale
  return durationSeconds > 0 ? track.nb_samples / durationSeconds : null
}

function fromMovie(movie: Movie): ContainerMetadata {
  const videoTrack = movie.videoTracks[0]
  const audioTrack = movie.audioTracks[0]
  return {
    audioBitrate: audioTrack?.bitrate ?? null,
    audioCodec: formatCodec(audioTrack?.codec),
    container: movie.brands.some((brand) => brand.trim() === 'qt') ? 'MOV' : 'MP4',
    frameRate: getAverageFrameRate(videoTrack),
    videoBitrate: videoTrack?.bitrate ?? null,
    videoCodec: formatCodec(videoTrack?.codec),
    streamCount: movie.tracks.length,
    videoStreamCount: movie.videoTracks.length,
    audioStreamCount: movie.audioTracks.length,
  }
}

export async function inspectContainer(
  file: File,
  isCancelled: () => boolean,
): Promise<ContainerMetadata | null> {
  const { createFile } = await import('mp4box')
  const parser = createFile(true)
  let result: ContainerMetadata | null = null
  let complete = false

  parser.onReady = (movie) => {
    result = fromMovie(movie)
    complete = true
  }
  parser.onError = () => {
    complete = true
  }

  let offset = 0
  const maximumOffset = Math.min(file.size, MAX_CONTAINER_INSPECTION_BYTES)
  while (offset < maximumOffset && !complete && !isCancelled()) {
    const end = Math.min(offset + CONTAINER_READ_CHUNK_BYTES, maximumOffset)
    const buffer = (await file.slice(offset, end).arrayBuffer()) as MP4BoxBuffer
    if (isCancelled()) return null
    buffer.fileStart = offset
    const nextOffset = parser.appendBuffer(buffer)
    offset = Number.isFinite(nextOffset) && nextOffset > offset ? nextOffset : end
  }

  parser.flush()
  return result
}
