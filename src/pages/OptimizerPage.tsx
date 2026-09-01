import { Alert } from '../components/common/Alert'
import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { ProgressBar } from '../components/common/ProgressBar'
import { PageContainer } from '../components/layout/PageContainer'
import { FfmpegEnginePanel } from '../components/optimizer/FfmpegEnginePanel'
import { LosslessOptimizerPanel } from '../components/optimizer/LosslessOptimizerPanel'
import { OptimizationMode } from '../components/optimizer/OptimizationMode'
import { OptimizationResult } from '../components/optimizer/OptimizationResult'
import { SmartConverterPanel } from '../components/optimizer/SmartConverterPanel'
import { VerificationPanel } from '../components/verification/VerificationPanel'
import { useFfmpegEngineContext } from '../hooks/useFfmpegEngineContext'
import { useVideoFileContext } from '../hooks/useVideoFileContext'
import { useLocalSettings } from '../hooks/useLocalSettings'

const stages = [
  'Analyzing',
  'Checking compatibility',
  'Preparing optimization',
  'Processing',
  'Verifying',
  'Complete',
]

export function OptimizerPage() {
  const { file, metadata, status } = useVideoFileContext()
  const { conversionResult, output, result, verificationResult } = useFfmpegEngineContext()
  const { settings, updateSettings } = useLocalSettings()
  const mode = settings.optimizationPreference

  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>OPTIMIZER</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        Processing workspace
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        Select a video from the home page to prepare a future local optimization job.
      </p>
      <div className="mt-6">
        <Alert title="Lossless-first processing">
          Only eligible streams can use container-level stream copying. A local download becomes
          available only after output validation succeeds.
        </Alert>
      </div>
      <OptimizationMode
        mode={mode}
        onChange={(preference) => updateSettings({ optimizationPreference: preference })}
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="min-h-72 p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--heading)]">SELECTED VIDEO</p>
          <div className="mt-5 grid min-h-48 place-items-center border border-dashed border-[var(--border-strong)] text-center text-sm text-[var(--muted)]">
            No video selected
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--heading)]">PROCESSING FLOW</p>
          <ol className="mt-5 space-y-4">
            {stages.map((stage) => (
              <li key={stage} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                <span className="grid h-5 w-5 place-items-center border border-[var(--border-strong)] text-[0.65rem]">
                  -
                </span>
                {stage}
              </li>
            ))}
          </ol>
          <div className="mt-7">
            <ProgressBar label="Awaiting a real processing job" />
          </div>
        </Card>
      </div>
      <div className="mt-4 max-w-xl">
        <OptimizationResult
          fileName={result?.outputFileName ?? conversionResult?.outputFileName}
          output={output}
          verification={verificationResult}
        />
      </div>
      <div className="mt-4 max-w-xl">
        <FfmpegEnginePanel canLoad={status === 'ready'} />
      </div>
      {metadata && verificationResult && (result || conversionResult) && (
        <div className="mt-4 max-w-3xl">
          <VerificationPanel
            original={metadata}
            output={verificationResult.outputMetadata}
            result={verificationResult}
          />
        </div>
      )}
      <div className="mt-4 max-w-xl">
        {mode === 'lossless' ? (
          <LosslessOptimizerPanel file={file} metadata={metadata} />
        ) : (
          <SmartConverterPanel file={file} metadata={metadata} />
        )}
      </div>
    </PageContainer>
  )
}
