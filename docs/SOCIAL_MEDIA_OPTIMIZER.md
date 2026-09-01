# Social Media Optimizer

Checked: 2026-09-02

## What this is

`/social` lets a user prepare an already-selected local video for Instagram, Facebook, WhatsApp, or TikTok, reusing the same local, lossless-first FFmpeg engine used by the Optimizer page. It does not upload anything and does not add any new FFmpeg command paths.

## Architecture

- `src/features/social-media/common/platformTypes.ts` — shared types: `SocialPlatformProfile`, `SocialDestinationProfile`, `UnknownOr<T>` (marks unverified spec fields), `getPlatformRealityStatement()`.
- `src/features/social-media/common/socialOptimizer.ts` — the decision engine. `evaluateSocialVideo(metadata, destination)` classifies a video as `already-optimal`, `lossless-optimization`, `requires-conversion`, or `unsupported` using the same codec/container compatibility rules as the existing lossless optimizer. `createSocialVideoPlan(...)` turns a decision into an `OptimizationPlan` or `SmartConversionPlan` with a platform-suffixed output filename (e.g. `clip_instagram.mp4`).
- `src/features/social-media/common/imageOptimizerStub.ts` — explicit "not implemented" result for image preparation, reused by every platform's `*ImageOptimizer.ts`.
- `src/features/social-media/common/platformRegistry.ts` — maps each platform to a dynamic `import()` so only the selected platform's module is loaded.
- `src/features/social-media/{instagram,facebook,whatsapp,tiktok}/` — one folder per platform, each with:
  - `{Platform}Profile.ts` — typed destination data (real values marked `UNKNOWN` where no official source was verified; see `docs/SOCIAL_MEDIA_SPECS.md`).
  - `{Platform}Rules.ts` — small platform-specific business rules (currently orientation guidance text).
  - `{Platform}Validator.ts` — combines generic and platform-specific checks into errors/warnings for the selected destination.
  - `{Platform}VideoOptimizer.ts` — the module actually lazy-loaded by the page; wires the profile into the shared `socialOptimizer.ts` functions.
  - `{Platform}ImageOptimizer.ts` — stub, returns `{ supported: false }`.
- `src/components/social/PlatformCard.tsx`, `src/components/social/SocialResultSummary.tsx` — UI reused only by `/social`.
- `src/pages/SocialPage.tsx` — the page itself: platform cards → destination buttons → decision/plan display → reused `FfmpegEnginePanel` → process button that calls the existing `optimize()`/`convert()` from `useFfmpegEngineContext()` → reused `VerificationPanel` and a `SocialResultSummary` with a `DownloadButton`.

## Why the existing engine was reused unchanged

`ffmpeg.worker.ts` and its lossless/Smart Conversion command builders were not touched. Social plans are ordinary `OptimizationPlan`/`SmartConversionPlan` objects with a platform-aware output filename; the worker cannot tell the difference between a job started from the Optimizer page or the Social page. This avoids introducing any new, unverified FFmpeg command path.

## Limitations (see `docs/STAGE_16_AUDIT.md` for the full list)

- Video only. Image preparation (including WhatsApp Profile Photo) is not implemented.
- One platform and one destination at a time. No simultaneous multi-platform output and no batch queue.
- No cropping, resizing, FPS conversion, duration trimming, or file-size limiting — only a warning when a vertical destination receives non-vertical source video.
- No metadata policy controls (Preserve/Strip/Platform Safe).
- Most platform numeric specs (exact aspect ratio, resolution, FPS, duration, file-size limits) are marked `UNKNOWN` because no accessible official source was verified for video (only Instagram's photo aspect-ratio rule and a WhatsApp media note were verified).
- The tool cannot control or guarantee anything about platform-side processing after upload; every result surfaces a platform-reality disclaimer.

## Maintenance notes

- To add a real verified spec value, replace the corresponding `UNKNOWN` in the platform's `*Profile.ts` and cite the source in `docs/SOCIAL_MEDIA_SPECS.md`.
- To add image support, implement a real image pipeline first, then replace the relevant `*ImageOptimizer.ts` stub — do not mark `supportsImageOptimization: true` in a profile until that pipeline is real and tested.
- Any new destination must be added to the platform's `*Profile.ts` `destinations` map; the page's destination list is derived from that map automatically.
