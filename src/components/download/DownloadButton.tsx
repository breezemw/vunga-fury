import { Button } from '../common/Button'

type DownloadButtonProps = { fileName?: string; output: Blob | null; verified: boolean }

export function DownloadButton({ fileName, output, verified }: DownloadButtonProps) {
  const canDownload = Boolean(output && fileName && verified)
  const download = () => {
    if (!output || !fileName) return
    const objectUrl = URL.createObjectURL(output)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = fileName
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
  return (
    <Button type="button" disabled={!canDownload} className="w-full" onClick={download}>
      DOWNLOAD OPTIMIZED VIDEO
    </Button>
  )
}
