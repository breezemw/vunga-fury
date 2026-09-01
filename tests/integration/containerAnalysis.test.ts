import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { inspectContainer } from '../../src/features/video-analysis/containerAnalysis'

async function fixtureAsFile(name: string) {
  const contents = await readFile(`tests/fixtures/generated/${name}`)
  return new File([contents], name, {
    type: name.endsWith('.mov') ? 'video/quicktime' : 'video/mp4',
  })
}

describe('real local container analysis', () => {
  it('reads H.264/AAC MP4 stream metadata', async () => {
    const result = await inspectContainer(await fixtureAsFile('h264-30fps.mp4'), () => false)

    expect(result).toMatchObject({
      audioCodec: 'AAC (mp4a.40.2)',
      container: 'MP4',
      frameRate: 30,
      streamCount: 2,
      videoCodec: 'H.264 (avc1.64001e)',
    })
  })

  it('reads the stream-copied MOV fixture', async () => {
    const result = await inspectContainer(await fixtureAsFile('h264-30fps.mov'), () => false)

    expect(result).toMatchObject({
      audioCodec: 'AAC (mp4a.40.2)',
      container: 'MOV',
      frameRate: 30,
      streamCount: 2,
      videoCodec: 'H.264 (avc1.64001e)',
    })
  })

  it('detects the real 60 FPS H.264 fixture', async () => {
    const result = await inspectContainer(await fixtureAsFile('h264-60fps.mp4'), () => false)

    expect(result).toMatchObject({ audioCodec: 'AAC (mp4a.40.2)', frameRate: 60 })
    expect(result?.videoCodec).toContain('H.264')
  })

  it('detects HEVC video and MP3 audio as distinct streams', async () => {
    const hevc = await inspectContainer(await fixtureAsFile('hevc-30fps.mp4'), () => false)
    const mp3Audio = await inspectContainer(await fixtureAsFile('h264-mp3-audio.mp4'), () => false)

    expect(hevc?.videoCodec).toContain('HEVC')
    expect(mp3Audio?.audioCodec).toContain('MP3')
  })
})
