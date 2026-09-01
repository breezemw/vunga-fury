# Social Media Optimizer Test Matrix

Checked: 2026-09-02

Only rows that were actually executed are marked PASS/FAIL with evidence. Everything else is explicitly NOT TESTED.

## Automated tests actually executed

| Test | Type | Result | Evidence |
| --- | --- | --- | --- |
| `evaluateSocialVideo` classifies already-optimal, lossless, requires-conversion, and unsupported cases | Unit (Vitest) | PASS | `tests/unit/socialOptimizer.test.ts`, 9/9 passing |
| `createSocialVideoPlan` produces correct plan shape and filename, returns null when unsupported | Unit (Vitest) | PASS | `tests/unit/socialOptimizer.test.ts`, 9/9 passing |
| `/social` route renders with the expected heading | E2E (Playwright, Chromium + mobile-chromium) | PASS | `tests/e2e/application.spec.ts` "renders every local application route" |
| Real H.264/AAC MP4 fixture prepared for Instagram Reel end-to-end (select platform, select destination, load engine, prepare, verify, download) | E2E (Playwright, Chromium desktop only) | PASS | `tests/e2e/application.spec.ts` "prepares a real local video for Instagram Reel through the Social page"; downloaded filename confirmed as `h264-30fps_instagram.mp4` |
| Selecting a platform lazy-loads only that platform's module | Build inspection | PASS | `npm run build` output shows separate `InstagramVideoOptimizer-*.js`, `FacebookVideoOptimizer-*.js`, `WhatsAppVideoOptimizer-*.js`, `TikTokVideoOptimizer-*.js` chunks |

## Explicitly NOT TESTED

| Scenario | Why not tested |
| --- | --- |
| Facebook, WhatsApp, and TikTok end-to-end processing flows | Only Instagram Reel was run through the real FFmpeg engine in this session to avoid duplicating slow FFmpeg-core E2E runs; the underlying decision engine is shared and unit-tested, but no platform-specific E2E exists for the other three. |
| Requires-conversion (re-encode) path through `/social` | No fixture with an incompatible codec/audio combination was run through `/social` end-to-end; only the unit tests exercise this branch. |
| HEVC or non-AAC fixtures through `/social` | Not run. |
| Large files (50 MB-1 GB) through `/social` | Not run; only the small generated fixture (`h264-30fps.mp4`) was used. |
| Mobile browser (mobile-chromium) real FFmpeg run through `/social` | Intentionally skipped, consistent with the existing Optimizer page pattern, to avoid loading FFmpeg-core twice per test run. |
| iOS Safari, Android Chrome, desktop Safari, Firefox, Edge | Not tested on any real device or non-Chromium engine. |
| Image destinations (WhatsApp Profile Photo) | Not implemented, therefore not testable. |
| Multi-platform simultaneous output, batch queue, custom mode, metadata policy | Not implemented, therefore not testable. |
