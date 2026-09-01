import type { VideoMetadata } from '../../features/video-analysis/videoTypes'
import type { QualityResultCategory } from '../../features/social-media/common/qualityCategory'
import { PLATFORM_SIDE_PROCESSING_DISCLOSURE } from '../../features/social-media/common/qualityCategory'
import { formatFileSize } from '../../lib/utils/formatFileSize'
import { Card } from '../common/Card'
import { DownloadButton } from '../download/DownloadButton'

type SocialResultSummaryProps = {
  destinationLabel: string
  fileName?: string
  limitation: string
  originalMetadata: VideoMetadata
  output: Blob | null
  outputMetadata: VideoMetadata | null
  platformName: string
  processingTimeMs?: number
  qualityCategory: QualityResultCategory | null
  verificationLabel: string | null
  verified: boolean
}

export function SocialResultSummary({
  destinationLabel,
  fileName,
  limitation,
  originalMetadata,
  output,
  outputMetadata,
  platformName,
  processingTimeMs,
  qualityCategory,
  verificationLabel,
  verified,
}: SocialResultSummaryProps) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">SOCIAL PREPARATION RESULT</p>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Platform</dt>
          <dd className="text-[var(--heading)]">{platformName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Destination</dt>
          <dd className="text-[var(--heading)]">{destinationLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Original</dt>
          <dd className="text-right text-[var(--heading)]">
            {originalMetadata.fileName} · {formatFileSize(originalMetadata.fileSize)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Output</dt>
          <dd className="text-right text-[var(--heading)]">
            {outputMetadata ? `${outputMetadata.fileName}` : 'Not yet produced'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Processing</dt>
          <dd className="text-[var(--heading)]">
            {processingTimeMs !== undefined ? `${(processingTimeMs / 1000).toFixed(1)} s` : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Verification</dt>
          <dd className="text-[var(--heading)]">{verificationLabel ?? 'Not yet verified'}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Quality result</dt>
          <dd className="text-[var(--heading)]">{qualityCategory ?? 'NOT-VERIFIED'}</dd>
        </div>
        <div className="border-t border-[var(--border)] pt-3">
          <dt className="text-[var(--muted)]">Platform limitation</dt>
          <dd className="mt-1 text-xs leading-5 text-[var(--muted)]">{limitation}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{PLATFORM_SIDE_PROCESSING_DISCLOSURE}</p>
      <div className="mt-5">
        <DownloadButton fileName={fileName} output={output} verified={verified} />
      </div>
    </Card>
  )
}
