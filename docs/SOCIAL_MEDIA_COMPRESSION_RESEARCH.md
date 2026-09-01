# Social Media Compression Reverse-Engineering Research

Checked: 2026-09-01

## Executive summary

This stage asked for deep forensic reverse-engineering of how Instagram, Facebook, WhatsApp, and TikTok re-encode uploaded media, including analysis of third-party "HD status" tools, controlled multi-variable upload experiments (resolution/bitrate/GOP/color/FPS/audio), and objective quality metrics (PSNR/SSIM/VMAF) on real platform outputs.

**None of the experimental work described above was performed.** It requires infrastructure that does not exist in this environment:

- Real, controlled accounts on Instagram, Facebook, WhatsApp, and TikTok to run repeated upload/download experiments.
- The ability to install and forensically analyze third-party native or mobile applications (this environment has no mobile device, no App Store/Play Store access, and no ability to install and run arbitrary third-party desktop apps for reverse engineering).
- Native video/image quality-metric tooling (FFprobe is available in this project only as a dev dependency used to *generate* test fixtures, not to analyze arbitrary third-party output files; no VMAF, PSNR, or SSIM tooling is installed).
- A general web search engine; only direct fetches of specific URLs are available, and the WhatsApp, Facebook, and TikTok help pages that would describe this behavior are JavaScript-rendered SPAs that did not yield extractable technical text (see `docs/SOCIAL_MEDIA_RESEARCH.md`).

Claiming to have performed this research without actually doing it would violate this project's core rule against fabricated claims. This document exists to say so plainly rather than inventing findings.

## What was actually found

Only one concrete, sourced fact was obtainable: Instagram's official photo-resolution rule (width 320-1080px, aspect ratio 1.91:1 to 3:4; see `docs/SOCIAL_MEDIA_RESEARCH.md` for the exact text and source). This is now enforced by the Instagram image profile.

No other platform-specific compression behavior, GOP/bitrate/resolution experiment result, third-party tool analysis, or "bypass" mechanism was verified. Sections 2-37 of the requested research plan (third-party tool analysis, WhatsApp experiment matrix, JPEG/video forensics, resolution/bitrate/FPS/GOP/color/audio/metadata/upload-path experiments, quality-metric computation, and a versioned research database under `data/social-media/`) were not executed, because doing so honestly requires real accounts, real uploads, and real comparison tooling that are not available here.

## What is implemented instead

Rather than fabricate a "bypass," VUNGA FURY implements the part of this request that is both legitimate and achievable locally:

1. **Never re-encode unnecessarily.** The existing lossless-first decision engine (video) and the new pixel-preservation-first decision engine (image) both default to keeping the original file, or only remuxing/copying metadata, whenever the source already meets what is verifiably known about a destination.
2. **A real, local Social Media Test Lab** (see `docs/SOCIAL_MEDIA_OPTIMIZER.md`) that lets a human operator record an original file, a VUNGA-FURY-prepared file, the platform/destination they manually uploaded it to, and then load back the file they manually downloaded from that platform afterward, for an honest local pixel/technical comparison. This is the only way this project can honestly support the "compare actual uploaded/downloaded result" requirement without an automated account-based upload capability.
3. **Honest result categories** (`LOSSLESS`, `PLATFORM-OPTIMIZED`, `QUALITY-PRESERVING`, `PLATFORM-REENCODED`, `PLATFORM-PROCESSING-DETECTED`, `NOT-VERIFIED`) are used everywhere a result is shown; the application never reports `BYPASSED` because no evidence of a bypass was ever obtained.

## Recommended follow-up (requires resources not available here)

- Obtain test accounts and run the WhatsApp Status experiment matrix described in the original request, using VUNGA FURY's Test Lab to record each trial.
- Install FFprobe-based forensic analysis of real third-party tool outputs if legally obtained sample files become available.
- Add VMAF/SSIM tooling (e.g., via a native binary or WASM build) if a future environment permits installing it, then wire it into `imageComparison.ts`/`videoComparison.ts` result reporting.
