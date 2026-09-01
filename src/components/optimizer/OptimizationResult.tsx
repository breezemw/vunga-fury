import type { VerificationResult } from '../../features/video-verification/verificationTypes'
import { DownloadButton } from '../download/DownloadButton'
import { Card } from '../common/Card'

type OptimizationResultProps = {
  fileName?: string
  output: Blob | null
  verification: VerificationResult | null
}

export function OptimizationResult({ fileName, output, verification }: OptimizationResultProps) {
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-sm font-semibold text-[var(--heading)]">OPTIMIZATION RESULT</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {verification?.success
          ? 'Output validation completed locally.'
          : 'A verified result will appear here only after a real processing job completes.'}
      </p>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-3">
          <dt className="text-[var(--muted)]">Video frames preserved</dt>
          <dd className="text-[var(--heading)]">
            {verification?.status === 'preserved'
              ? 'Confirmed'
              : verification
                ? 'Not claimed'
                : 'Pending verification'}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-3">
          <dt className="text-[var(--muted)]">Output verified</dt>
          <dd className="text-[var(--heading)]">
            {verification?.success ? 'Confirmed' : 'Pending verification'}
          </dd>
        </div>
      </dl>
      <div className="mt-6">
        <DownloadButton
          fileName={fileName}
          output={output}
          verified={Boolean(verification?.success)}
        />
      </div>
    </Card>
  )
}
