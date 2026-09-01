import { PLATFORM_SIDE_PROCESSING_DISCLOSURE } from '../../features/social-media/common/qualityCategory'
import { getImageQualityCategory } from '../../features/social-media/images/imageComparison'
import type { SocialImagePreparationResult } from '../../features/social-media/images/imageComparison'
import { formatFileSize } from '../../lib/utils/formatFileSize'
import { Card } from '../common/Card'
import { DownloadButton } from '../download/DownloadButton'

type SocialImageResultSummaryProps = {
  preparation: SocialImagePreparationResult
}

export function SocialImageResultSummary({ preparation }: SocialImageResultSummaryProps) {
  const { comparison, outputBlob, outputFileName } = preparation
  const qualityCategory = getImageQualityCategory(
    comparison.decision.status,
    comparison.pixelComparison.status,
  )

  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">SOCIAL IMAGE PREPARATION RESULT</p>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Destination</dt>
          <dd className="text-[var(--heading)]">{comparison.decision.destination.targetSurface}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Original</dt>
          <dd className="text-right text-[var(--heading)]">
            {comparison.original.width} × {comparison.original.height} ·{' '}
            {formatFileSize(comparison.original.fileSize)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Output</dt>
          <dd className="text-right text-[var(--heading)]">
            {comparison.output.width} × {comparison.output.height} ·{' '}
            {formatFileSize(comparison.output.fileSize)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Pixel comparison</dt>
          <dd className="text-right text-[var(--heading)]">{comparison.pixelComparison.message}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Color handling</dt>
          <dd className="text-right text-[var(--heading)]">{comparison.colorHandling.message}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--muted)]">Quality result</dt>
          <dd className="text-[var(--heading)]">{qualityCategory}</dd>
        </div>
        <div className="border-t border-[var(--border)] pt-3">
          <dt className="text-[var(--muted)]">Platform limitation</dt>
          <dd className="mt-1 text-xs leading-5 text-[var(--muted)]">
            {comparison.decision.destination.limitations}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{PLATFORM_SIDE_PROCESSING_DISCLOSURE}</p>
      <div className="mt-5">
        <DownloadButton fileName={outputFileName} output={outputBlob} verified={Boolean(preparation)} />
      </div>
    </Card>
  )
}
