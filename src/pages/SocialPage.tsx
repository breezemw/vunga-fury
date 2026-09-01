import { useEffect, useMemo, useState } from 'react'
import { AppLink } from '../app/routes'
import { Alert } from '../components/common/Alert'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { ProgressBar } from '../components/common/ProgressBar'
import { Spinner } from '../components/common/Spinner'
import { PageContainer } from '../components/layout/PageContainer'
import { FfmpegEnginePanel } from '../components/optimizer/FfmpegEnginePanel'
import { PlatformCard } from '../components/social/PlatformCard'
import { SocialResultSummary } from '../components/social/SocialResultSummary'
import { VerificationPanel } from '../components/verification/VerificationPanel'
import { SOCIAL_PLATFORM_LOADERS } from '../features/social-media/common/platformRegistry'
import { getPlatformRealityStatement } from '../features/social-media/common/platformTypes'
import type { SocialPlatformKey } from '../features/social-media/common/platformTypes'
import type { SocialPlatformModule } from '../features/social-media/common/socialOptimizer'
import type { OptimizationPlan, SmartConversionPlan } from '../features/video-optimization/optimizationTypes'
import { useFfmpegEngineContext } from '../hooks/useFfmpegEngineContext'
import { useVideoFileContext } from '../hooks/useVideoFileContext'

const PLATFORM_CARDS: Array<{ description: string; key: SocialPlatformKey; name: string }> = [
  {
    description: 'Feed Posts, Stories, and Reels.',
    key: 'instagram',
    name: 'INSTAGRAM',
  },
  {
    description: 'Feed Posts, Stories, and Reels.',
    key: 'facebook',
    name: 'FACEBOOK',
  },
  {
    description: 'Chats and Status updates.',
    key: 'whatsapp',
    name: 'WHATSAPP',
  },
  {
    description: 'Video uploads.',
    key: 'tiktok',
    name: 'TIKTOK',
  },
]

const PROCESSING_STATUSES = new Set(['loading', 'processing', 'verifying'])

type ActiveJob = {
  destinationLabel: string
  fileName: string
  limitation: string
  platformLabel: string
}

export function SocialPage() {
  const { file, metadata, status: videoStatus } = useVideoFileContext()
  const {
    cancel,
    convert,
    conversionResult,
    message,
    optimize,
    output,
    processingStatus,
    progress,
    result,
    status: engineStatus,
    verificationResult,
  } = useFfmpegEngineContext()

  const [platformKey, setPlatformKey] = useState<SocialPlatformKey | null>(null)
  const [platformModule, setPlatformModule] = useState<SocialPlatformModule | null>(null)
  const [destinationKey, setDestinationKey] = useState<string | null>(null)
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null)
  const isLoadingModule = Boolean(platformKey) && !platformModule

  // Reset dependent selections synchronously during render when the platform
  // or destination changes, instead of via a setState-in-effect anti-pattern.
  const [lastPlatformKey, setLastPlatformKey] = useState(platformKey)
  if (platformKey !== lastPlatformKey) {
    setLastPlatformKey(platformKey)
    setPlatformModule(null)
    setDestinationKey(null)
    setActiveJob(null)
  }

  const [lastDestinationKey, setLastDestinationKey] = useState(destinationKey)
  if (destinationKey !== lastDestinationKey) {
    setLastDestinationKey(destinationKey)
    setActiveJob(null)
  }

  useEffect(() => {
    if (!platformKey) return
    let cancelled = false
    SOCIAL_PLATFORM_LOADERS[platformKey]().then((loadedModule) => {
      if (!cancelled) setPlatformModule(loadedModule)
    })
    return () => {
      cancelled = true
    }
  }, [platformKey])

  const destination = useMemo(() => {
    if (!platformModule || !destinationKey) return null
    return platformModule.profile.destinations[destinationKey] ?? null
  }, [platformModule, destinationKey])

  const decision = useMemo(() => {
    if (!platformModule || !metadata || !destinationKey) return null
    return platformModule.analyzeVideo(metadata, destinationKey)
  }, [platformModule, metadata, destinationKey])

  const validation = useMemo(() => {
    if (!platformModule || !metadata || !destinationKey) return null
    return platformModule.validate(metadata, destinationKey)
  }, [platformModule, metadata, destinationKey])

  const plan = useMemo(() => {
    if (!platformModule || !metadata || !destinationKey) return null
    return platformModule.planVideo(metadata.fileName, metadata, destinationKey)
  }, [platformModule, metadata, destinationKey])

  const isProcessing = PROCESSING_STATUSES.has(processingStatus)
  const canProcess = Boolean(
    file &&
      metadata &&
      plan &&
      decision &&
      decision.status !== 'unsupported' &&
      (validation?.errors.length ?? 0) === 0 &&
      engineStatus === 'ready' &&
      !isProcessing,
  )

  const handleProcess = () => {
    if (!file || !metadata || !plan || !decision || !destination || !platformModule) return
    setActiveJob({
      destinationLabel: destination.targetSurface,
      fileName: plan.outputFileName,
      limitation: destination.limitations,
      platformLabel: platformModule.profile.platformName,
    })
    if (decision.status === 'requires-conversion') {
      convert(file, metadata, plan as SmartConversionPlan)
    } else {
      optimize(file, metadata, plan as OptimizationPlan)
    }
  }

  const videoDestinations = platformModule
    ? Object.entries(platformModule.profile.destinations).filter(
        ([, value]) => value.mediaType === 'video',
      )
    : []
  const imageOnlyDestinations = platformModule
    ? Object.entries(platformModule.profile.destinations).filter(
        ([, value]) => value.mediaType !== 'video',
      )
    : []

  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>SOCIAL MEDIA OPTIMIZER</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        Prepare video for Instagram, Facebook, WhatsApp, and TikTok
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        Choose a platform and destination to prepare your already-selected local video with the
        same lossless-first, verified engine used elsewhere in VUNGA FURY.
      </p>
      <div className="mt-6">
        <Alert title="Platform reality">
          This tool prepares files locally only. It cannot control how Instagram, Facebook,
          WhatsApp, or TikTok process files after upload, and does not bypass platform-side
          compression. Image preparation, batch processing, and simultaneous multi-platform
          output are not implemented yet.
        </Alert>
      </div>

      {videoStatus !== 'ready' && (
        <div className="mt-6 max-w-2xl">
          <Alert title="No video ready">
            Select and analyze a local video on the{' '}
            <AppLink href="/" className="underline">
              home page
            </AppLink>{' '}
            before preparing it for a platform.
          </Alert>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_CARDS.map((card) => (
          <PlatformCard
            key={card.key}
            name={card.name}
            description={card.description}
            isSelected={platformKey === card.key}
            onSelect={() => setPlatformKey(card.key)}
          />
        ))}
      </div>

      {platformKey && isLoadingModule && (
        <div className="mt-6">
          <Spinner label="Loading platform module…" />
        </div>
      )}

      {platformModule && !isLoadingModule && (
        <Card className="mt-6 p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--heading)]">DESTINATION</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {videoDestinations.map(([key, value]) => (
              <Button
                key={key}
                type="button"
                variant={destinationKey === key ? 'primary' : 'secondary'}
                onClick={() => setDestinationKey(key)}
              >
                {value.targetSurface}
              </Button>
            ))}
          </div>
          {imageOnlyDestinations.length > 0 && (
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              {imageOnlyDestinations.map(([, value]) => value.targetSurface).join(', ')}{' '}
              {imageOnlyDestinations.length === 1 ? 'is an image-only destination' : 'are image-only destinations'} and
              not available here because image preparation is not implemented.
            </p>
          )}

          {platformKey === 'whatsapp' && destinationKey === 'chat' && (
            <p className="mt-4 border-l-2 border-[var(--border-strong)] bg-[var(--surface-raised)] p-3 text-xs leading-5 text-[var(--muted)]">
              Sending a file as a &ldquo;Document&rdquo; in WhatsApp (instead of as media) can
              avoid WhatsApp&apos;s own media re-compression. This is a choice made inside
              WhatsApp when attaching the file; VUNGA FURY only prepares the file locally and
              cannot change how WhatsApp transmits it.
            </p>
          )}

          {destination && metadata && decision && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <p className="text-sm leading-6 text-[var(--muted)]">{decision.reason}</p>
              {decision.warnings.map((warning) => (
                <p key={warning} className="mt-2 text-xs leading-5 text-[#f3d39c]">
                  {warning}
                </p>
              ))}
              {validation?.errors.map((errorMessage) => (
                <p key={errorMessage} className="mt-2 text-xs leading-5 text-[#e08a8a]">
                  {errorMessage}
                </p>
              ))}
              {validation?.warnings.map((warningMessage) => (
                <p key={warningMessage} className="mt-2 text-xs leading-5 text-[#f3d39c]">
                  {warningMessage}
                </p>
              ))}
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{destination.notes}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Source: {destination.sourceDocumentation}
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                {getPlatformRealityStatement(platformModule.profile.platformName)}
              </p>
            </div>
          )}

          {destination && (
            <div className="mt-6">
              <FfmpegEnginePanel canLoad={videoStatus === 'ready'} />
            </div>
          )}

          {destination && (
            <div className="mt-4">
              {isProcessing ? (
                <>
                  <ProgressBar
                    label={message ?? 'Preparing video for platform'}
                    value={progress ?? undefined}
                  />
                  <Button type="button" variant="secondary" className="mt-4" onClick={cancel}>
                    CANCEL PROCESSING
                  </Button>
                </>
              ) : (
                <Button type="button" disabled={!canProcess} onClick={handleProcess}>
                  {platformModule
                    ? `PREPARE FOR ${platformModule.profile.platformName.toUpperCase()}`
                    : 'PREPARE'}
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {activeJob && metadata && verificationResult && (result || conversionResult) && (
        <div className="mt-6 grid gap-4 max-w-3xl">
          <VerificationPanel
            original={metadata}
            output={verificationResult.outputMetadata}
            result={verificationResult}
          />
          <SocialResultSummary
            destinationLabel={activeJob.destinationLabel}
            fileName={result?.outputFileName ?? conversionResult?.outputFileName}
            limitation={activeJob.limitation}
            originalMetadata={metadata}
            output={output}
            outputMetadata={verificationResult.outputMetadata}
            platformName={activeJob.platformLabel}
            processingTimeMs={result?.processingTime ?? conversionResult?.processingTime}
            verificationLabel={verificationResult.status}
            verified={verificationResult.success}
          />
        </div>
      )}
    </PageContainer>
  )
}
