import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { PageContainer } from '../components/layout/PageContainer'
import { UploadZone } from '../components/upload/UploadZone'
import { Alert } from '../components/common/Alert'
import { VideoMetadata } from '../components/video/VideoMetadata'
import { VideoPreview } from '../components/video/VideoPreview'
import { useVideoFileContext } from '../hooks/useVideoFileContext'

export function HomePage() {
  const { metadata, objectUrl, status, warnings } = useVideoFileContext()
  return (
    <PageContainer>
      <section className="max-w-3xl py-14 sm:py-20 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)]">
          PRIVATE VIDEO OPTIMIZER
        </p>
        <h1 className="mt-5 text-4xl font-medium leading-[1.06] text-[var(--heading)] sm:text-5xl">
          Optimize your video before uploading.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
          Lossless-first video optimization performed locally in your browser whenever supported.
        </p>
      </section>
      <UploadZone />
      {status === 'ready' && metadata && objectUrl && (
        <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="overflow-hidden">
            <VideoPreview fileName={metadata.fileName} objectUrl={objectUrl} />
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="mb-5 text-sm font-semibold text-[var(--heading)]">
              LOCAL VIDEO METADATA
            </h2>
            <VideoMetadata metadata={metadata} />
          </Card>
        </section>
      )}
      {warnings.length > 0 && (
        <div className="mt-4">
          <Alert title="Analysis notes" tone="warning">
            <ul className="space-y-1">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </Alert>
        </div>
      )}
      <section className="grid gap-4 py-8 md:grid-cols-3">
        {[
          ['LOCAL BY DESIGN', 'Your selected video remains in this browser.'],
          ['LOSSLESS-FIRST', 'Future processing will avoid re-encoding whenever possible.'],
          ['PLATFORM REALITY', 'Destination platforms control their own final encoding.'],
        ].map(([title, description]) => (
          <Card key={title} className="p-5">
            <Badge>{title}</Badge>
            <p className="mt-4 text-sm leading-6 text-[var(--text)]">{description}</p>
          </Card>
        ))}
      </section>
    </PageContainer>
  )
}
