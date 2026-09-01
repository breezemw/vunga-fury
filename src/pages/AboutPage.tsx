import { Badge } from '../components/common/Badge'
import { Card } from '../components/common/Card'
import { PageContainer } from '../components/layout/PageContainer'

const sections = [
  [
    'What it will do',
    'VUNGA FURY will inspect compatible local videos, favor stream-preserving container optimization, and verify the output before download.',
  ],
  [
    'What it cannot guarantee',
    'Upload destinations control their own server-side encoding. An optimized file cannot prevent a platform from processing it again.',
  ],
  [
    'Privacy',
    'The intended default workflow stays in your browser. No account or default server-side video upload is part of this application.',
  ],
  [
    'Browser compatibility',
    'Processing support will depend on browser capabilities, video codecs, device memory, and worker support. Limitations will be reported clearly.',
  ],
]

export function AboutPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <Badge>ABOUT VUNGA FURY</Badge>
      <h1 className="mt-4 text-3xl font-medium text-[var(--heading)] sm:text-4xl">
        A private upload-preparation tool
      </h1>
      <div className="mt-6 grid max-w-4xl gap-4 md:grid-cols-2">
        {sections.map(([title, description]) => (
          <Card key={title} className="p-5 sm:p-6">
            <h2 className="text-lg font-medium text-[var(--heading)]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
