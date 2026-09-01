# Security

## Local Input Handling

VUNGA FURY accepts MP4 and MOV selections only after checking extension, browser MIME type when present, nonzero size, configured maximum size, browser preview APIs, and actual readable video metadata. The original file is never overwritten.

Output names are sanitized to alphanumeric characters, dots, underscores, and hyphens before use. The FFmpeg worker validates names again at runtime, rejects path traversal, requires an `.mp4` output name, requires a real `File` payload, and accepts only the `lossless` or `conversion` modes.

## Processing Safety

No UI accepts arbitrary FFmpeg commands. The worker selects only one of two reviewed command templates: lossless stream copy or the documented Smart Conversion profile. Uploaded files are mounted as local WORKERFS files. Temporary FFmpeg output and mounts are removed after processing, and workers are terminated on cancellation or terminal verification.

## Web Security

The source contains no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, dynamic `Function`, remote data fetch, authentication, tracker, or analytics integration. React escapes rendered text. Object URLs are revoked on replacement, cleanup, post-verification, or after a download has started.

The static-host `_headers` file and Vite production preview set a CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Cross-Origin-Resource-Policy`. The CSP permits only same-origin content plus required `blob:` media/worker URLs and `wasm-unsafe-eval` for FFmpeg.wasm. It has no `unsafe-inline` script or style exception. A deployment provider must support `_headers` or configure equivalent response headers.

## Verification Scope

Production preview confirmed the security headers, shell/service-worker behavior, no cross-origin application requests, and an FFmpeg worker response to malformed runtime input. The FFmpeg worker emitted its initial loading event under preview CSP, but full core initialization did not finish within the 110-second browser test budget; full processing with production headers remains unverified.
