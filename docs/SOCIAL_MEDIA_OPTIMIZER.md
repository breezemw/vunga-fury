# Social Media Optimizer

Checked: 2026-09-01

## What this is

`/social` lets a user prepare an already-selected local video or image for Instagram, Facebook, WhatsApp, or TikTok. Video preparation reuses the same local, lossless-first FFmpeg engine used by the Optimizer page. Image preparation uses a new, real, browser-only Canvas-based engine that never resizes or recompresses unless a verified official rule requires it. Nothing is uploaded by this application; `/social-test-lab` lets an operator record a real, manually-performed upload/download comparison.

## Architecture — shared

- `src/features/social-media/common/platformTypes.ts` — shared video types: `SocialPlatformProfile`, `SocialDestinationProfile`, `UnknownOr<T>`, `getPlatformRealityStatement()`.
- `src/features/social-media/common/socialOptimizer.ts` — the video decision engine (`evaluateSocialVideo`, `createSocialVideoPlan`) plus `getVideoQualityCategory()`, which maps the engine's internal status and the real local verification result onto the user-facing quality vocabulary.
- `src/features/social-media/common/qualityCategory.ts` — the shared result vocabulary (`LOSSLESS`, `PLATFORM-OPTIMIZED`, `QUALITY-PRESERVING`, `NOT-VERIFIED`) and the always-shown `PLATFORM_SIDE_PROCESSING_DISCLOSURE` string, used by both the video and image result displays.
- `src/features/social-media/common/platformRegistry.ts` — maps each platform to a dynamic `import()` so only the selected platform's module (video **and** image capability together) is loaded.

## Architecture — image engine (new)

- `src/features/social-media/images/imageMetadata.ts` — real file-header (magic-byte) format detection and aspect-ratio computation.
- `src/features/social-media/images/imageAnalyzer.ts` — `analyzeImage(file)`: reads real width/height/format/alpha via `createImageBitmap` and a small Canvas sample, on the main thread (no FFmpeg or video-worker modules are loaded for image-only work).
- `src/features/social-media/images/imageOptimizer.ts` — `evaluateSocialImage()`: pixel-preservation-first decision engine (keep original unless a verified width range requires a resize; never resizes more than once). `processSocialImage()` performs the actual, real Canvas 2D resize/re-encode when required.
- `src/features/social-media/images/imageVerifier.ts` — `compareImagePixels()`: real byte-for-byte comparison, falling back to a full decoded-pixel comparison, and reports `PIXEL DATA IDENTICAL` or `PIXEL DATA CHANGED` with an evidence-based percentage.
- `src/features/social-media/images/imageColor.ts` — documents the real, verifiable limitation that Canvas 2D re-encoding always rasterizes onto sRGB, so wide-gamut/ICC/HDR color data cannot be preserved through a re-encode.
- `src/features/social-media/images/imageComparison.ts` — combines the above into one result object and exposes `getImageQualityCategory()`.
- `src/features/social-media/images/imageProfiles.ts` — the shared `ImageDestinationProfile` type.
- `src/features/social-media/{instagram,facebook,whatsapp,tiktok}/{Platform}ImageProfile.ts` — per-platform destination data. Only Instagram's Feed Post/Story/Reel-cover destinations enforce a real, sourced rule (width 320-1080px, aspect ratio 1.91:1-3:4, from `help.instagram.com`). Facebook, WhatsApp, and TikTok have no verified numeric image specification, so their profiles keep every field `UNKNOWN`, which means the engine only ever preserves the original file unchanged for those platforms today.
- `src/features/social-media/{instagram,facebook,whatsapp,tiktok}/{Platform}ImageOptimizer.ts` — the real `prepare{Platform}Image()` function used by the UI; re-exported from each platform's `*VideoOptimizer.ts` lazy-load entry point so a single dynamic import provides both video and image capability.

## Test Lab (new)

- `src/features/social-media/testLab/testLabTypes.ts` — `classifyTestLabResult()`, a pure function that turns a real dimension/format-or-codec/pixel comparison into one of the required categories: `PRESERVED`, `PARTIALLY PRESERVED`, `PLATFORM PROCESSED`, `RE-ENCODED`, `UNKNOWN`, `NOT TESTED`.
- `src/pages/SocialTestLabPage.tsx` (`/social-test-lab`) — lets an operator manually record: platform, destination, upload method, and two files (the file VUNGA FURY prepared, and the file manually downloaded back from the platform after uploading). Runs a real local comparison (pixel comparison for images; codec/container/resolution comparison for video, reusing the existing video analyzer) and displays the result. Records exist only in the current browser tab for the current session and are not persisted to IndexedDB or disk.

## Why the existing video engine was reused unchanged

`ffmpeg.worker.ts` and its lossless/Smart Conversion command builders were not touched. Social video plans are ordinary `OptimizationPlan`/`SmartConversionPlan` objects with a platform-aware output filename; the worker cannot tell the difference between a job started from the Optimizer page or the Social page.

## Quality result vocabulary

Every result — video or image — is labeled with exactly one of: `LOSSLESS` (verified byte/pixel-identical or stream-copy-verified), `QUALITY-PRESERVING` (the source already met the destination's requirements; nothing was changed), `PLATFORM-OPTIMIZED` (one controlled local conversion/resize pass was applied to meet a verified requirement), or `NOT-VERIFIED` (local verification could not confirm the result, or no verified rule exists). A separate, always-shown disclosure states that platform-side server processing after upload is never controlled or verified by this application. The application never reports a "bypass".

## Limitations (see `docs/STAGE_16_AUDIT.md` and `docs/STAGE_SOCIAL_MEDIA_FINAL_AUDIT.md` for the full list)

- Only Instagram's image width/aspect-ratio rule is a verified, enforced numeric rule; every other platform/media-type numeric specification is `UNKNOWN` (see `docs/SOCIAL_MEDIA_RESEARCH.md`).
- No live platform upload testing, third-party app reverse engineering, or VMAF/PSNR/SSIM measurement was performed (see `docs/SOCIAL_MEDIA_COMPRESSION_RESEARCH.md`) — no test accounts, native quality-metric tooling, or general web search exist in this environment.
- Image color management is real but limited: Canvas 2D always rasterizes to sRGB, so wide-gamut/ICC/HDR color cannot be preserved through any re-encode; only an unmodified original preserves it exactly.
- One platform and one destination at a time. No simultaneous multi-platform output and no batch queue.
- No cropping. A vertical-destination/landscape-source mismatch (video) or an out-of-range aspect ratio (image) is only warned about, never auto-corrected.
- No metadata policy controls (Preserve/Strip/Platform Safe).
- The Test Lab requires the operator to manually perform the actual upload and download; nothing in this application uploads to any platform.

## Maintenance notes

- To add a real verified spec value, replace the corresponding `UNKNOWN` in the platform's `*Profile.ts`/`*ImageProfile.ts` and cite the source in `docs/SOCIAL_MEDIA_SPECS.md`.
- Any new destination must be added to the platform's `*Profile.ts`/`*ImageProfile.ts` map; the page's destination list is derived from that map automatically.
- Do not mark a numeric field with a real value unless it is backed by an accessible, cited official source, or by real evidence recorded in the Test Lab.
