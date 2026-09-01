# Architecture

VUNGA FURY is a static React application. Its intended production workflow is local: select a file, validate it, analyze it, process it in a browser worker, verify the output, and download the result. No backend is required for the core workflow.

The React main thread owns interface state, navigation, local file references, and worker communication. Bounded MP4/MOV container parsing now runs in `analysis.worker.ts`; the browser video element remains on the main thread because it provides preview and readable-stream metadata. The analysis worker is created only for analysis and terminated when the job completes, errors, is cancelled, or the selected file is replaced.

`ffmpeg.worker.ts` hosts the lazy FFmpeg.wasm wrapper and its single-thread core. It loads `@ffmpeg/ffmpeg` 0.12.15 with locally bundled ESM assets from `@ffmpeg/core` 0.12.10 only after a user requests engine preparation. The wrapper internally runs its own worker, so FFmpeg work remains off the React main thread. `verification.worker.ts` compares analyzed output to original metadata and creates a bounded SHA-256 output hash.

All workers use the commands `LOAD`, `ANALYZE`, `OPTIMIZE`, `VERIFY`, `CANCEL`, and `CLEANUP`, and return `LOADING`, `PROGRESS`, `COMPLETE`, `ERROR`, or `CANCELLED` responses. The FFmpeg engine is terminated when cancelled, when loading fails, after verification, or when the application unmounts.

The Stage 6 `OPTIMIZE` command is a fixed lossless stream-copy profile. The main thread sends the original `File` and a reviewed plan to the FFmpeg worker; the worker mounts the file with WORKERFS, runs the fixed remux command, returns a single MP4 output buffer, and deletes the output/unmounts the source. The React layer never constructs arbitrary FFmpeg command strings.

Stage 8 adds an independent `verification.worker.ts`. After every optimization, the main thread analyzes the returned local output with the browser video element and analysis worker, then sends original/output metadata and the output `File` to the verification worker. That worker performs property comparisons and a bounded SHA-256 output hash before returning a structured verification result. The download control receives the output only after the verification result reports successful output validation.

Browser capabilities are detected locally through feature detection, not browser-name allowlists. Missing optional APIs limit future enhancements but do not block local file selection or preview. IndexedDB will contain preferences and limited job metadata, never unbounded video storage.

Stage 9 implements `vunga-fury-db` at schema version 2. Its stores are `settings`, `jobs`, and `metadata`. `settings` contains non-sensitive local preferences, `jobs` stores at most 25 metadata-only verified history entries in memory and IndexedDB, and `metadata` holds small expirable records only. No video file, Blob, FFmpeg output, or preview media is written to IndexedDB. The provider falls back to in-memory settings/history when IndexedDB is unavailable.
