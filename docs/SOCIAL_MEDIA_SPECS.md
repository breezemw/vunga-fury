# Social Media Video Specifications

Checked: 2026-09-02

This document lists only what was actually implemented and what was actually verified against an accessible official source. Values that could not be verified are marked `UNKNOWN` rather than invented, per project policy. Source data lives in `src/features/social-media/{platform}/{Platform}Profile.ts`.

## Verified official sources used

| Fact | Source | Applies to |
| --- | --- | --- |
| Instagram photo aspect ratio: 320-1080px width, 1.91:1 to 4:5 | https://help.instagram.com/1631821640426723 | Instagram **photos** only. Not used to constrain video, since it does not cover video. |
| WhatsApp HD/quality media availability varies by app version, network, and settings | https://faq.whatsapp.com/iphone/chats/how-to-send-media/ | WhatsApp Chat video/media sending |

No other official, accessible video specification page (exact resolution, FPS, duration limit, or file-size limit) was located for Instagram, Facebook, WhatsApp, or TikTok during this implementation.

## Instagram

| Destination | Orientation | Container | Video codec | Audio codec | Aspect ratio | Dimensions | FPS | Duration | File size |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Feed Post | Flexible | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Story | Vertical | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Reel | Vertical | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

## Facebook

| Destination | Orientation | Container | Video codec | Audio codec | Aspect ratio | Dimensions | FPS | Duration | File size |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Feed Post | Flexible | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Story | Vertical | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Reel | Vertical | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

## WhatsApp

| Destination | Orientation | Container | Video codec | Audio codec | Aspect ratio | Dimensions | FPS | Duration | File size |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chat | Flexible | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Status | Vertical | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| Profile Photo | N/A | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

Profile Photo is image-only and not implemented; the app does not offer it as a selectable video destination.

## TikTok

| Destination | Orientation | Container | Video codec | Audio codec | Aspect ratio | Dimensions | FPS | Duration | File size |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Video | Vertical | MP4 (recommended) | H.264 (recommended) | AAC (recommended) | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

## What the app actually enforces today

Regardless of the `UNKNOWN` fields above, the implemented decision engine (`evaluateSocialVideo` in `src/features/social-media/common/socialOptimizer.ts`) only checks, using real, verifiable local video analysis:

1. Container is MP4 or MOV (otherwise: unsupported).
2. Destination expects video, not image (otherwise: unsupported).
3. Video codec is H.264 or HEVC and audio codec is AAC or absent (otherwise: requires re-encode via the existing tested Smart Conversion path).
4. Orientation warning shown (not enforced/blocked) when a vertical destination receives non-vertical source video.

No aspect-ratio cropping, resizing, FPS conversion, duration trimming, or file-size limiting is implemented for any platform.
