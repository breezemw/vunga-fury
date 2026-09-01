# Social Media Optimizer

## Status

Not implemented. The current product is a local video optimizer with lossless-first and Smart Conversion profiles. It has no social-platform selector, image pipeline, multi-platform outputs, or batch queue.

## Future Architecture

A future implementation should separate platform modules under `src/features/social-media/`:

- `common/` for typed platform profile contracts and safe decision logic
- `instagram/`, `facebook/`, `whatsapp/`, and `tiktok/` for independently versioned rules and validators

Each profile must cite current official documentation, state the date checked, use `UNKNOWN` for ambiguous values, and declare platform-side processing as outside the tool's control.

## Processing Principles

- Analyze local media before selecting a preparation path.
- Preserve originals whenever they are already suitable.
- Prefer stream copy or remux for compatible video.
- Re-encode once only when justified and disclose it.
- Do not upscale, change aspect ratio, or change frame rate unless the selected profile requires it.
- Never accept raw FFmpeg commands from users.
- Verify every output locally before enabling download.

## Privacy

A social optimizer must preserve the current local-only architecture. Media can pass only between the browser UI and same-origin workers; it must not be uploaded to third-party services.

## Maintenance

Platform rules change. Update profile rules only after reviewing official sources, updating `SOCIAL_MEDIA_SPECS.md`, adding fixtures, and executing the matching test-matrix row.
