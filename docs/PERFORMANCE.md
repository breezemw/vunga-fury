# Performance

The initial page does not load FFmpeg or a video-processing engine. Those assets will be lazy-loaded only after a user begins a supported workflow.

Stage 5 keeps the FFmpeg wrapper, worker, core JavaScript, and approximately 32 MB single-thread WASM core out of the initial page request path. They are loaded only by the FFmpeg worker after an explicit engine request. The multi-thread core is not used because it requires `SharedArrayBuffer` and cross-origin isolation.

Future processing will avoid retaining redundant Blob, ArrayBuffer, preview, and virtual-file copies. Workers will be terminated or cleaned after jobs, temporary URLs revoked, and temporary FFmpeg files removed. Performance limits must be measured on real browsers and devices before support claims are made.

For the Stage 6 stream-copy profile, the original `File` is mounted from the FFmpeg worker using WORKERFS rather than read into a main-thread `ArrayBuffer`. The returned MP4 output requires one in-memory buffer before later download support can consume it; that buffer is cleared on engine cleanup or application unmount.

Stage 8 verifies the output through the existing bounded analysis worker path. SHA-256 hashing occurs in a dedicated verification worker and is limited to outputs at or below 64 MB; this intentionally avoids allocating a second full-file buffer for larger output files.

Stage 9 does not cache video files in IndexedDB. Browser quota estimates are displayed when available and warn at 90% reported usage. Expired metadata cleanup is performed only when the persisted automatic-cleanup preference is enabled.

## Stage 10 Audit

Selecting or clearing a new video aborts active analysis, revokes the prior preview URL, clears output references, and terminates any retained FFmpeg worker. The FFmpeg worker also deletes its output, unmounts WORKERFS input, and removes its temporary mount directory at the end of each command. The engine is terminated after either successful or failed output verification, so the approximately 32 MB WASM core is not retained after a completed job.

Worker progress state updates are limited to at most every 100 ms unless progress changes by at least one percentage point or reaches completion. This avoids rerendering the React provider tree for every FFmpeg progress event. New optimization requests are rejected while loading, processing, or verifying.

The production build separates `analyzeVideo` into a 1.97 KB lazy chunk, `analysis.worker` into a 185.64 KB worker asset, `verification.worker` into a 2.68 KB worker asset, and the FFmpeg worker/core assets from the initial bundle. A fresh local home-page test made no analysis, worker, FFmpeg-core, or verification-worker asset request before selection.

The app warns before 500 MB files are processed and gives an earlier warning above 100 MB when the browser reports 2 GiB or less of device memory. These warnings do not claim a device's exact capacity when it is unavailable. Small real fixtures are tested; 50 MB, 100 MB, 250 MB, 500 MB, and 1 GB measurements remain unrecorded.
