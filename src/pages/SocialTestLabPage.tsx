import { useState } from 'react'
import { Alert } from '../components/common/Alert'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { PageContainer } from '../components/layout/PageContainer'
import { analyzeImage } from '../features/social-media/images/imageAnalyzer'
import { compareImagePixels } from '../features/social-media/images/imageVerifier'
import {
  classifyTestLabResult,
  type TestLabMediaType,
  type TestLabRecord,
  type TestLabUploadMethod,
} from '../features/social-media/testLab/testLabTypes'

const UPLOAD_METHODS: Array<{ label: string; value: TestLabUploadMethod }> = [
  { label: 'Mobile app', value: 'mobile-app' },
  { label: 'Desktop web', value: 'desktop-web' },
  { label: 'Share sheet', value: 'share-sheet' },
  { label: 'Official upload/publishing API', value: 'official-api' },
  { label: 'Other', value: 'other' },
]

export function SocialTestLabPage() {
  const [platform, setPlatform] = useState('Instagram')
  const [destination, setDestination] = useState('')
  const [uploadMethod, setUploadMethod] = useState<TestLabUploadMethod>('mobile-app')
  const [mediaType, setMediaType] = useState<TestLabMediaType>('image')
  const [preparedFile, setPreparedFile] = useState<File | null>(null)
  const [platformResultFile, setPlatformResultFile] = useState<File | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<TestLabRecord[]>([])

  const canCompare = Boolean(preparedFile && platformResultFile && destination.trim() && !isComparing)

  const runComparison = async () => {
    if (!preparedFile || !platformResultFile) return
    setIsComparing(true)
    setError(null)
    try {
      if (mediaType === 'image') {
        const [preparedMetadata, resultMetadata, pixelComparison] = await Promise.all([
          analyzeImage(preparedFile),
          analyzeImage(platformResultFile),
          compareImagePixels(preparedFile, platformResultFile),
        ])
        const dimensionsMatch =
          preparedMetadata.width === resultMetadata.width && preparedMetadata.height === resultMetadata.height
        const formatMatch = preparedMetadata.format === resultMetadata.format
        const category = classifyTestLabResult({
          dimensionsMatch,
          formatOrCodecMatch: formatMatch,
          pixelStatus: pixelComparison.status,
        })
        const record: TestLabRecord = {
          destination: destination.trim(),
          details: `${pixelComparison.message} Dimensions: ${preparedMetadata.width}×${preparedMetadata.height} → ${resultMetadata.width}×${resultMetadata.height}. Format: ${preparedMetadata.format} → ${resultMetadata.format}.`,
          id: crypto.randomUUID(),
          mediaType,
          platform,
          recordedAt: new Date().toISOString(),
          result: category,
          uploadMethod,
        }
        setRecords((current) => [record, ...current])
      } else {
        const { analyzeVideo } = await import('../features/video-analysis/analyzeVideo')
        const preparedUrl = URL.createObjectURL(preparedFile)
        const resultUrl = URL.createObjectURL(platformResultFile)
        try {
          const [preparedAnalysis, resultAnalysis] = await Promise.all([
            analyzeVideo(preparedFile, preparedUrl, new AbortController().signal),
            analyzeVideo(platformResultFile, resultUrl, new AbortController().signal),
          ])
          const dimensionsMatch =
            preparedAnalysis.metadata.width === resultAnalysis.metadata.width &&
            preparedAnalysis.metadata.height === resultAnalysis.metadata.height
          const codecMatch =
            preparedAnalysis.metadata.videoCodec === resultAnalysis.metadata.videoCodec &&
            preparedAnalysis.metadata.container === resultAnalysis.metadata.container
          const category = classifyTestLabResult({
            dimensionsMatch,
            formatOrCodecMatch: codecMatch,
            pixelStatus: 'not-compared',
          })
          const record: TestLabRecord = {
            destination: destination.trim(),
            details: `Resolution: ${preparedAnalysis.metadata.width}×${preparedAnalysis.metadata.height} → ${resultAnalysis.metadata.width}×${resultAnalysis.metadata.height}. Codec: ${preparedAnalysis.metadata.videoCodec ?? 'Unavailable'} → ${resultAnalysis.metadata.videoCodec ?? 'Unavailable'}. Container: ${preparedAnalysis.metadata.container} → ${resultAnalysis.metadata.container}.`,
            id: crypto.randomUUID(),
            mediaType,
            platform,
            recordedAt: new Date().toISOString(),
            result: category,
            uploadMethod,
          }
          setRecords((current) => [record, ...current])
        } finally {
          URL.revokeObjectURL(preparedUrl)
          URL.revokeObjectURL(resultUrl)
        }
      }
    } catch {
      setError('This comparison could not be completed. Confirm both files are valid and of the selected media type.')
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>SOCIAL MEDIA TEST LAB</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        Compare a real upload/download result
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        VUNGA FURY cannot upload to any platform on its own. To find out what a platform actually
        did to a prepared file, upload the prepared file to the platform yourself, then download
        the result back from that platform and compare it here.
      </p>
      <div className="mt-6 max-w-2xl">
        <Alert title="This tool does not upload anything" tone="warning">
          Records are kept only in this browser tab for this session; they are not saved to disk
          or sent anywhere. Reloading this page clears them.
        </Alert>
      </div>

      <Card className="mt-6 max-w-2xl p-5 sm:p-6">
        <p className="text-sm font-semibold text-[var(--heading)]">RECORD A COMPARISON</p>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-1 text-sm text-[var(--muted)]">
            Platform
            <select
              className="min-h-11 border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[var(--heading)]"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="TikTok">TikTok</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm text-[var(--muted)]">
            Destination (e.g. "Reel", "Status", "Feed Post")
            <input
              className="min-h-11 border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[var(--heading)]"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm text-[var(--muted)]">
            Upload method actually used
            <select
              className="min-h-11 border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[var(--heading)]"
              value={uploadMethod}
              onChange={(event) => setUploadMethod(event.target.value as TestLabUploadMethod)}
            >
              {UPLOAD_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={mediaType === 'image' ? 'primary' : 'secondary'}
              onClick={() => setMediaType('image')}
            >
              IMAGE
            </Button>
            <Button
              type="button"
              variant={mediaType === 'video' ? 'primary' : 'secondary'}
              onClick={() => setMediaType('video')}
            >
              VIDEO
            </Button>
          </div>
          <label className="grid gap-1 text-sm text-[var(--muted)]">
            Prepared file (the file VUNGA FURY produced, before you uploaded it)
            <input
              type="file"
              className="text-sm text-[var(--muted)]"
              onChange={(event) => setPreparedFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="grid gap-1 text-sm text-[var(--muted)]">
            Platform result file (what you manually downloaded back from the platform)
            <input
              type="file"
              className="text-sm text-[var(--muted)]"
              onChange={(event) => setPlatformResultFile(event.target.files?.[0] ?? null)}
            />
          </label>
          {error && <p className="text-xs leading-5 text-[#e08a8a]">{error}</p>}
          <Button type="button" disabled={!canCompare} onClick={() => void runComparison()}>
            {isComparing ? 'COMPARING…' : 'COMPARE'}
          </Button>
        </div>
      </Card>

      {records.length > 0 && (
        <div className="mt-6 grid max-w-2xl gap-4">
          {records.map((record) => (
            <Card key={record.id} className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[var(--heading)]">
                  {record.platform} · {record.destination}
                </p>
                <span className="border border-[var(--border-strong)] px-2 py-1 text-xs font-semibold text-[var(--heading)]">
                  {record.result}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {record.mediaType.toUpperCase()} · {record.uploadMethod} · {record.recordedAt}
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{record.details}</p>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
