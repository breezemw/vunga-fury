import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useVideoFileContext } from '../../hooks/useVideoFileContext'
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities'
import { Button } from '../common/Button'

type UploadState = 'empty' | 'dragging' | 'selected' | 'loading' | 'error' | 'disabled'

export function UploadZone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { clear, errors, file, selectFile, status } = useVideoFileContext()
  const capabilities = useDeviceCapabilities()
  const [state, setState] = useState<UploadState>('empty')
  const selectLocalFile = (nextFile: File | undefined) => {
    if (nextFile) void selectFile(nextFile)
  }
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) =>
    selectLocalFile(event.target.files?.[0])
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    selectLocalFile(event.dataTransfer.files[0])
  }
  const isDragging = state === 'dragging'

  return (
    <div
      className={`border border-dashed p-6 text-center transition-colors hover:border-[var(--accent)] sm:p-12 ${isDragging ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-strong)] bg-[var(--surface-raised)]'}`}
      onDragEnter={(event) => {
        event.preventDefault()
        setState('dragging')
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setState(file ? 'selected' : 'empty')}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        className="sr-only"
        id="video-file"
        type="file"
        accept="video/mp4,video/quicktime,.mp4,.mov"
        aria-label="Choose an MP4 or MOV video"
        tabIndex={-1}
        onChange={onFileChange}
      />
      {capabilities.mode === 'limited' && status === 'empty' && (
        <p className="mb-5 text-sm leading-6 text-[#f3d39c]">
          This device appears constrained. Large-video processing may take longer or run out of
          memory.
        </p>
      )}
      {status === 'validating' || status === 'analyzing' ? (
        <div role="status" aria-live="polite">
          <p className="text-sm font-semibold text-[var(--heading)]">ANALYZING LOCAL VIDEO</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Reading metadata from your device. Your file is not being uploaded.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full sm:w-auto"
            onClick={clear}
          >
            CANCEL ANALYSIS
          </Button>
        </div>
      ) : status === 'error' ? (
        <div role="alert">
          <p className="text-sm font-semibold text-[#f3d39c]">FILE SELECTION NEEDS ATTENTION</p>
          <ul className="mt-3 space-y-1 text-sm leading-6 text-[var(--muted)]">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          <Button
            type="button"
            className="mt-6 w-full sm:w-auto"
            onClick={() => inputRef.current?.click()}
          >
            CHOOSE ANOTHER VIDEO
          </Button>
        </div>
      ) : status === 'ready' && file ? (
        <>
          <p className="text-sm font-semibold text-[var(--heading)]">LOCAL VIDEO READY</p>
          <p className="mt-2 break-all text-sm text-[var(--muted)]">{file.name}</p>
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
            Metadata was read locally. The original file has not been modified or uploaded.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-6 w-full sm:w-auto"
            onClick={() => inputRef.current?.click()}
          >
            CHOOSE ANOTHER VIDEO
          </Button>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)]">
            LOCAL FILE SELECTION
          </p>
          <h2 className="mt-4 text-2xl font-medium text-[var(--heading)]">DROP YOUR VIDEO HERE</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">or choose a file from your device</p>
          <Button
            type="button"
            className="mt-6 w-full sm:w-auto"
            onClick={() => inputRef.current?.click()}
          >
            CHOOSE VIDEO
          </Button>
          <p className="mt-6 text-sm text-[var(--muted)]">MP4 &#8226; MOV</p>
        </>
      )}
    </div>
  )
}
