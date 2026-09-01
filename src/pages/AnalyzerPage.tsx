import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { Spinner } from '../components/common/Spinner'
import { PageContainer } from '../components/layout/PageContainer'
import { VideoMetadata } from '../components/video/VideoMetadata'
import { VideoPreview } from '../components/video/VideoPreview'
import { useVideoFileContext } from '../hooks/useVideoFileContext'

export function AnalyzerPage() {
  const { metadata, objectUrl, status } = useVideoFileContext()
  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>LOCAL ANALYZER</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        Technical video inspection
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        Inspect video properties locally before deciding whether to optimize.
      </p>
      <Card className="mt-6 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--heading)]">VIDEO PROPERTIES</p>
          <Spinner
            label={status === 'analyzing' ? 'Analyzing local video' : 'Waiting for a selected file'}
          />
        </div>
        {metadata ? (
          <div className="mt-6">
            <VideoMetadata metadata={metadata} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-[var(--muted)]">No local video has been selected.</p>
        )}
      </Card>
      {metadata && objectUrl && (
        <Card className="mt-4 overflow-hidden">
          <VideoPreview fileName={metadata.fileName} objectUrl={objectUrl} />
        </Card>
      )}
    </PageContainer>
  )
}
