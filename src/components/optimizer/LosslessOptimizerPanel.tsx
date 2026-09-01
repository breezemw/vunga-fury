import { createOptimizationPlan } from '../../features/video-optimization/losslessOptimizer'
import { formatFileSize } from '../../lib/utils/formatFileSize'
import { useFfmpegEngineContext } from '../../hooks/useFfmpegEngineContext'
import type { VideoMetadata } from '../../features/video-analysis/videoTypes'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { ProgressBar } from '../common/ProgressBar'

type LosslessOptimizerPanelProps = { file: File | null; metadata: VideoMetadata | null }

export function LosslessOptimizerPanel({ file, metadata }: LosslessOptimizerPanelProps) {
  const { cancel, message, optimize, processingStatus, progress, result, status } =
    useFfmpegEngineContext()
  const plan = metadata
    ? createOptimizationPlan({ ...metadata, fileName: metadata.fileName })
    : null
  const canOptimize = Boolean(
    file &&
    metadata &&
    plan?.mode === 'lossless' &&
    status === 'ready' &&
    processingStatus !== 'loading' &&
    processingStatus !== 'processing' &&
    processingStatus !== 'verifying',
  )

  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">LOSSLESS CONTAINER OPTIMIZATION</p>
      {plan ? (
        <>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{plan.reason}</p>
          {plan.warnings.map((warning) => (
            <p key={warning} className="mt-2 text-xs leading-5 text-[#f3d39c]">
              {warning}
            </p>
          ))}
          {processingStatus === 'loading' || processingStatus === 'processing' ? (
            <>
              <div className="mt-5">
                <ProgressBar
                  label={message ?? 'Processing local video'}
                  value={progress ?? undefined}
                />
              </div>
              <Button type="button" variant="secondary" className="mt-6" onClick={cancel}>
                CANCEL PROCESSING
              </Button>
            </>
          ) : (
            <Button
              type="button"
              className="mt-6"
              disabled={!canOptimize}
              onClick={() => file && metadata && optimize(file, metadata, plan)}
            >
              OPTIMIZE VIDEO
            </Button>
          )}
          {result && (
            <dl className="mt-6 grid gap-3 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Mode</dt>
                <dd className="text-[var(--heading)]">Lossless container optimization</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Re-encoded</dt>
                <dd className="text-[var(--heading)]">No</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Output size</dt>
                <dd className="text-[var(--heading)]">{formatFileSize(result.outputSize)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--muted)]">Processing time</dt>
                <dd className="text-[var(--heading)]">
                  {(result.processingTime / 1000).toFixed(1)} s
                </dd>
              </div>
            </dl>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Select a fully analyzed local video to create an optimization plan.
        </p>
      )}
    </Card>
  )
}
