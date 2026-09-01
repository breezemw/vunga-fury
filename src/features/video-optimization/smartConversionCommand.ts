import { VERTICAL_SOCIAL_VIDEO_PROFILE } from '../../config/videoConfig'

export function buildSmartConversionCommand(inputPath: string, outputPath: string) {
  const profile = VERTICAL_SOCIAL_VIDEO_PROFILE
  return [
    '-i',
    inputPath,
    '-map',
    '0:v:0',
    '-map',
    '0:a?',
    '-vf',
    `scale='min(${profile.maxWidth},iw)':'min(${profile.maxHeight},ih)':force_original_aspect_ratio=decrease`,
    '-c:v',
    'libx264',
    '-preset',
    profile.videoPreset,
    '-crf',
    String(profile.videoCrf),
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    profile.audioBitrate,
    '-movflags',
    '+faststart',
    outputPath,
  ]
}
