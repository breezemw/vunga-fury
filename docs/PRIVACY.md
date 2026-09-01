# Privacy

VUNGA FURY is designed for local browser processing. Stage 1 makes no network request for user video data and contains no account, analytics, advertising tracker, telemetry, remote storage, or backend.

Stage 9 stores only non-sensitive application data locally in IndexedDB: theme, preferred optimization mode, automatic-cleanup preference, and metadata-only completed-job history. History entries include filename, date, duration, resolution, mode, status, and processing time. The application never writes video files, Blobs, previews, or FFmpeg output to IndexedDB.

`CLEAR LOCAL DATA` deletes the entire `vunga-fury-db` database, including settings, history, and expirable metadata. No account, remote database, tracking, or default video upload is involved.

## Network And Offline Behavior

The video-processing path passes the selected `File` only between the browser main thread and same-origin workers. FFmpeg receives the file through its local WORKERFS mount; it does not send the file to a network service. A production-preview network audit found no cross-origin application requests.

The optional service worker caches the application shell and small same-origin application assets after they are requested. It never caches requests with a `video` destination, never caches WASM, and rejects cache entries larger than 1 MB. It does not cache user files, preview object URLs, or processing output. Offline navigation was verified only after the shell was previously loaded; offline video analysis and processing are not claimed.
