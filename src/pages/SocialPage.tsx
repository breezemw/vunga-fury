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
import { SocialImageResultSummary } from '../components/social/SocialImageResultSummary'
import { SocialResultSummary } from '../components/social/SocialResultSummary'
import { VerificationPanel } from '../components/verification/VerificationPanel'
import { SOCIAL_PLATFORM_LOADERS } from '../features/social-media/common/platformRegistry'
import { getPlatformRealityStatement } from '../features/social-media/common/platformTypes'
import type { SocialPlatformKey } from '../features/social-media/common/platformTypes'
import { getVideoQualityCategory } from '../features/social-media/common/socialOptimizer'
import type { SocialPlatformModule } from '../features/social-media/common/socialOptimizer'
import { PLATFORM_SIDE_PROCESSING_DISCLOSURE } from '../features/social-media/common/qualityCategory'
import { analyzeImage } from '../features/social-media/images/imageAnalyzer'
import { evaluateSocialImage } from '../features/social-media/images/imageOptimizer'
import type { ImageMetadata } from '../features/social-media/images/imageMetadata'
import type { SocialImagePreparationResult } from '../features/social-media/images/imageComparison'
import type { OptimizationPlan, SmartConversionPlan } from '../features/video-optimization/optimizationTypes'
import { useFfmpegEngineContext } from '../hooks/useFfmpegEngineContext'
import { useVideoFileContext } from '../hooks/useVideoFileContext'

type MediaType = 'video' | 'image'

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

const OPEN_PLATFORM_LINKS: Record<SocialPlatformKey, { label: string; url: string }> = {
  facebook: { label: 'OPEN FACEBOOK', url: 'https://www.facebook.com/' },
  instagram: { label: 'OPEN INSTAGRAM', url: 'https://www.instagram.com/' },
  tiktok: { label: 'OPEN TIKTOK', url: 'https://www.tiktok.com/upload' },
  whatsapp: { label: 'OPEN WHATSAPP WEB', url: 'https://web.whatsapp.com/' },
}

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

  const [mediaType, setMediaType] = useState<MediaType>('video')
  const [platformKey, setPlatformKey] = useState<SocialPlatformKey | null>(null)
  const [platformModule, setPlatformModule] = useState<SocialPlatformModule | null>(null)
  const [destinationKey, setDestinationKey] = useState<string | null>(null)
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null)
  const isLoadingModule = Boolean(platformKey) && !platformModule

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null)
  const [imagePreparation, setImagePreparation] = useState<SocialImagePreparationResult | null>(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  // Reset dependent selections synchronously during render when the media
  // type, platform, or destination changes, instead of via a
  // setState-in-effect anti-pattern.
  const [lastMediaType, setLastMediaType] = useState(mediaType)
  if (mediaType !== lastMediaType) {
    setLastMediaType(mediaType)
    setDestinationKey(null)
    setActiveJob(null)
    setImageFile(null)
    setImageMetadata(null)
    setImagePreparation(null)
    setImageError(null)
  }

  const [lastPlatformKey, setLastPlatformKey] = useState(platformKey)
  if (platformKey !== lastPlatformKey) {
    setLastPlatformKey(platformKey)
    setPlatformModule(null)
    setDestinationKey(null)
    setActiveJob(null)
    setImageFile(null)
    setImageMetadata(null)
    setImagePreparation(null)
    setImageError(null)
  }

  const [lastDestinationKey, setLastDestinationKey] = useState(destinationKey)
  if (destinationKey !== lastDestinationKey) {
    setLastDestinationKey(destinationKey)
    setActiveJob(null)
    setImagePreparation(null)
    setImageError(null)
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
    if (!platformModule || !destinationKey || mediaType !== 'video') return null
    return platformModule.profile.destinations[destinationKey] ?? null
  }, [platformModule, destinationKey, mediaType])

  const decision = useMemo(() => {
    if (!platformModule || !metadata || !destinationKey || mediaType !== 'video') return null
    return platformModule.analyzeVideo(metadata, destinationKey)
  }, [platformModule, metadata, destinationKey, mediaType])

  const validation = useMemo(() => {
    if (!platformModule || !metadata || !destinationKey || mediaType !== 'video') return null
    return platformModule.validate(metadata, destinationKey)
  }, [platformModule, metadata, destinationKey, mediaType])

  const plan = useMemo(() => {
    if (!platformModule || !metadata || !destinationKey || mediaType !== 'video') return null
    return platformModule.planVideo(metadata.fileName, metadata, destinationKey)
  }, [platformModule, metadata, destinationKey, mediaType])

  const imageDestination = useMemo(() => {
    if (!platformModule || !destinationKey || mediaType !== 'image') return null
    return platformModule.imageProfile[destinationKey] ?? null
  }, [platformModule, destinationKey, mediaType])

  const imageDecision = useMemo(() => {
    if (!imageDestination || !imageMetadata) return null
    return evaluateSocialImage(imageMetadata, imageDestination)
  }, [imageDestination, imageMetadata])

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
  const canProcessImage = Boolean(imageFile && imageMetadata && imageDestination && imageDecision && !isProcessingImage)

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

  const handleSelectImage = async (nextFile: File) => {
    setImageFile(nextFile)
    setImageMetadata(null)
    setImagePreparation(null)
    setImageError(null)
    try {
      const nextMetadata = await analyzeImage(nextFile)
      setImageMetadata(nextMetadata)
    } catch {
      setImageError('This file could not be read as an image in this browser.')
      setImageFile(null)
    }
  }

  const handleProcessImage = async () => {
    if (!imageFile || !destinationKey || !platformModule) return
    setIsProcessingImage(true)
    setImageError(null)
    try {
      const preparation = await platformModule.prepareImage(imageFile, destinationKey)
      setImagePreparation(preparation)
    } catch {
      setImageError('Local image processing failed in this browser.')
    } finally {
      setIsProcessingImage(false)
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
  const imageDestinationEntries = platformModule ? Object.entries(platformModule.imageProfile) : []

  const videoQualityCategory = decision
    ? getVideoQualityCategory(decision.status, verificationResult?.status ?? null)
    : null
  const openPlatformLink = platformKey ? OPEN_PLATFORM_LINKS[platformKey] : null
  const showOpenPlatformLinks =
    (mediaType === 'video' && Boolean(activeJob && verificationResult)) ||
    (mediaType === 'image' && Boolean(imagePreparation))

  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>SOCIAL MEDIA OPTIMIZER</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        Prepare video for Instagram, Facebook, WhatsApp, and TikTok
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        Choose a platform, media type, and destination to prepare your media with a
        pixel/stream-preservation-first local engine. Every result is verified locally before
        download; nothing is uploaded by this application.
      </p>
      <div className="mt-6">
        <Alert title="Platform reality">
          This tool prepares files locally only. It cannot control how Instagram, Facebook,
          WhatsApp, or TikTok process files after upload, and does not bypass platform-side
          compression. Simultaneous multi-platform output and a batch queue are not implemented
          yet. See{' '}
          <AppLink href="/social-test-lab" className="underline">
            the Test Lab
          </AppLink>{' '}
          to record a real, manually-performed upload/download comparison for a platform.
        </Alert>
      </div>

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

      {platformKey && (
        <Card className="mt-6 p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--heading)]">MEDIA TYPE</p>
          <div className="mt-4 flex gap-3">
            <Button
              type="button"
              variant={mediaType === 'video' ? 'primary' : 'secondary'}
              onClick={() => setMediaType('video')}
            >
              VIDEO
            </Button>
            <Button
              type="button"
              variant={mediaType === 'image' ? 'primary' : 'secondary'}
              onClick={() => setMediaType('image')}
            >
              IMAGE
            </Button>
          </div>
        </Card>
      )}

      {platformKey && isLoadingModule && (
        <div className="mt-6">
          <Spinner label="Loading platform module…" />
        </div>
      )}

      {platformModule && !isLoadingModule && mediaType === 'video' && videoStatus !== 'ready' && (
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

      {platformModule && !isLoadingModule && mediaType === 'video' && (
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
              {imageOnlyDestinations.length === 1 ? 'is an image-only destination' : 'are image-only destinations'}
              . Switch MEDIA TYPE to IMAGE above to prepare an image for this platform instead.
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

      {platformModule && !isLoadingModule && mediaType === 'image' && (
        <Card className="mt-6 p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--heading)]">DESTINATION</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {imageDestinationEntries.map(([key, value]) => (
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

          {destinationKey && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <label className="block text-sm font-semibold text-[var(--heading)]" htmlFor="social-image-input">
                SELECT IMAGE
              </label>
              <input
                id="social-image-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="mt-3 block text-sm text-[var(--muted)]"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0]
                  if (nextFile) void handleSelectImage(nextFile)
                }}
              />
              {imageError && <p className="mt-2 text-xs leading-5 text-[#e08a8a]">{imageError}</p>}
            </div>
          )}

          {imageDestination && imageMetadata && imageDecision && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <p className="text-sm leading-6 text-[var(--muted)]">{imageDecision.reason}</p>
              {imageDecision.warnings.map((warning) => (
                <p key={warning} className="mt-2 text-xs leading-5 text-[#f3d39c]">
                  {warning}
                </p>
              ))}
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{imageDestination.notes}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                Source: {imageDestination.sourceDocumentation}
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                {getPlatformRealityStatement(platformModule.profile.platformName)}
              </p>
            </div>
          )}

          {imageDestination && (
            <div className="mt-4">
              {isProcessingImage ? (
                <Spinner label="Processing image locally…" />
              ) : (
                <Button type="button" disabled={!canProcessImage} onClick={() => void handleProcessImage()}>
                  {`PREPARE FOR ${platformModule.profile.platformName.toUpperCase()}`}
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {mediaType === 'video' &&
        activeJob &&
        metadata &&
        verificationResult &&
        (result || conversionResult) && (
          <div className="mt-6 grid max-w-3xl gap-4">
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
              qualityCategory={videoQualityCategory}
              verificationLabel={verificationResult.status}
              verified={verificationResult.success}
            />
          </div>
        )}

      {mediaType === 'image' && imagePreparation && (
        <div className="mt-6 max-w-3xl">
          <SocialImageResultSummary preparation={imagePreparation} />
        </div>
      )}

      {showOpenPlatformLinks && openPlatformLink && (
        <Card className="mt-4 max-w-3xl p-5 sm:p-6">
          <p className="text-sm font-semibold text-[var(--heading)]">NEXT STEP</p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            {PLATFORM_SIDE_PROCESSING_DISCLOSURE} This does not upload automatically — download
            the prepared file above, then open {platformModule?.profile.platformName} yourself to
            upload it.
          </p>
          <a
            href={openPlatformLink.url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex min-h-12 items-center border border-[var(--border-strong)] bg-[var(--surface-raised)] px-5 text-sm font-semibold tracking-[0.06em] text-[var(--heading)] hover:border-[var(--muted)]"
          >
            {openPlatformLink.label}
          </a>
        </Card>
      )}
    </PageContainer>
  )
}

