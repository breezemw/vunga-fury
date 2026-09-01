import type { VideoMetadata } from '../../features/video-analysis/videoTypes'
import type { VerificationResult } from '../../features/video-verification/verificationTypes'
import { Card } from '../common/Card'

type VerificationPanelProps = {
  original: VideoMetadata
  output: VideoMetadata
  result: VerificationResult
}

const statusLabels = {
  inconclusive: 'UNABLE TO VERIFY',
  preserved: 'VIDEO STREAM PRESERVED',
  reencoded: 'VIDEO WAS RE-ENCODED',
  failed: 'OUTPUT VERIFICATION FAILED',
} as const

export function VerificationPanel({ original, output, result }: VerificationPanelProps) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">VERIFICATION</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <section aria-labelledby="original-heading">
          <h2
            id="original-heading"
            className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)]"
          >
            ORIGINAL
          </h2>
          <p className="mt-2 text-sm text-[var(--heading)]">{original.fileName}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {original.videoCodec ?? 'Unavailable'} ·{' '}
            {original.width && original.height
              ? `${original.width} × ${original.height}`
              : 'Unavailable'}
          </p>
        </section>
        <section aria-labelledby="output-heading">
          <h2
            id="output-heading"
            className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)]"
          >
            OUTPUT
          </h2>
          <p className="mt-2 text-sm text-[var(--heading)]">{output.fileName}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {output.videoCodec ?? 'Unavailable'} ·{' '}
            {output.width && output.height ? `${output.width} × ${output.height}` : 'Unavailable'}
          </p>
        </section>
      </div>
      <section
        className="mt-5 border-l-2 border-[var(--accent)] bg-[var(--surface-raised)] p-4"
        aria-labelledby="status-heading"
      >
        <h2
          id="status-heading"
          className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)]"
        >
          STATUS
        </h2>
        <p className="mt-2 text-sm font-semibold text-[var(--heading)]">
          {statusLabels[result.status]}
        </p>
      </section>
      {result.warnings.length > 0 && (
        <section className="mt-5" aria-labelledby="warnings-heading">
          <h2
            id="warnings-heading"
            className="text-xs font-semibold tracking-[0.08em] text-[var(--muted)]"
          >
            WARNINGS
          </h2>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-[#f3d39c]">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      )}
      <details className="mt-5 border-t border-[var(--border)] pt-4">
        <summary className="block min-h-11 cursor-pointer py-3 text-sm font-semibold text-[var(--heading)]">
          TECHNICAL DETAILS
        </summary>
        <dl className="mt-4 grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
          {result.comparisons.map((comparison) => (
            <div key={comparison.label} className="border-b border-[var(--border)] pb-3">
              <dt className="font-medium text-[var(--heading)]">{comparison.label}</dt>
              <dd className="mt-1 text-[var(--muted)]">Original: {comparison.original}</dd>
              <dd className="text-[var(--muted)]">Output: {comparison.output}</dd>
              <dd className="mt-1 text-xs text-[var(--text)]">
                {comparison.matches === true
                  ? 'Match'
                  : comparison.matches === false
                    ? 'Different'
                    : 'Unavailable'}
              </dd>
            </div>
          ))}
          <div className="border-b border-[var(--border)] pb-3">
            <dt className="font-medium text-[var(--heading)]">Output SHA-256</dt>
            <dd className="mt-1 break-all text-xs text-[var(--muted)]">
              {result.outputHash ?? 'Unavailable for files larger than 64 MB'}
            </dd>
          </div>
        </dl>
      </details>
    </Card>
  )
}
