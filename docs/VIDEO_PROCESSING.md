# Video Processing

Stage 5 integrates a real, lazy-loaded single-thread FFmpeg.wasm engine. It uses `@ffmpeg/ffmpeg` 0.12.15 and the locally bundled `@ffmpeg/core` 0.12.10 ESM assets. The engine successfully initializes in the browser without contacting a video API, CDN, or backend.

The Stage 6 lossless profile accepts fully analyzed MP4 or MOV files only when the detected video codec is H.264 or HEVC and the detected audio codec is AAC or unavailable. It creates a separate `original-name_optimized.mp4` file and runs the fixed command template:

```text
-i INPUT -map 0 -c copy -movflags +faststart OUTPUT
```

`-c copy` copies streams without decoding or encoding, so this profile does not re-encode video or audio. `-movflags +faststart` reorganizes MP4 metadata for progressive playback; it does not enhance visual quality. The worker mounts the original `File` through WORKERFS, reads one output buffer, deletes the temporary output, unmounts the input, and retains no FFmpeg file-system data after the job.

The profile can still fail for unusual streams or MP4-incompatible tracks. It returns a user-facing error and does not fall back to re-encoding. Output verification is required before download, and the UI does not claim that video frames were preserved unless verification confirms it.

The planned default is a lossless-first MP4 remux using stream-copy behavior when the input and browser processing engine support it. A stream-copy operation must preserve encoded streams and be reported as container optimization, not as a guarantee about downstream platform compression.

Stage 7 adds Smart Conversion as an explicit alternate mode. Its recommended vertical social-video profile uses the fixed command template:

```text
-i INPUT -map 0:v:0 -map 0:a? -vf scale=min(1080,iw):min(1920,ih):force_original_aspect_ratio=decrease -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart OUTPUT
```

The profile re-encodes video as H.264 and audio as AAC. It preserves aspect ratio, does not use an `-r` frame-rate override, and limits output dimensions without upscaling beyond 1080 by 1920. These are sensible recommendations, not claimed destination-platform requirements.

Every Smart Conversion output is passed back through the local video-analysis path before the app sets its conversion status to complete. It must be readable, have a video stream with dimensions and duration, and identify as MP4. A failed analysis surfaces an error and does not expose a successful conversion result. Download enables only after successful output validation.

## Output Verification

Stage 8 analyzes every lossless and Smart Conversion output again. It compares container, video codec, width, height, frame rate, duration, audio codec, audio bitrate, video bitrate, pixel format, and stream count. Unavailable source or output metadata is shown as unavailable, never treated as a match.

Lossless operations display `VIDEO STREAM PRESERVED` only when the stream-copy profile completed and the essential available stream properties match. If a required property is unavailable or differs, the output may still be readable but displays `UNABLE TO VERIFY`. Smart Conversion displays `VIDEO WAS RE-ENCODED` because the configured profile explicitly encodes H.264/AAC.

For outputs no larger than 64 MB, the verification worker calculates SHA-256. This hash identifies the complete output file bytes at the time of verification. It does not prove that the output has the same visual frames as the input, and matching metadata does not prove frame identity. Hashing is skipped for larger outputs to avoid another large in-memory copy.

The Download Optimized Video action is enabled only after output validation succeeds. Failed verification reports `Output verification failed.` and retains no downloadable output result.
