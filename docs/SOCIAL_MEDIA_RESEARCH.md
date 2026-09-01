# Social Media Platform Research

Checked: 2026-09-01

This document records what was actually verified against accessible official sources during this session, and is explicit about what could not be accessed. No claim in this document, or in the application, is based on invented specifications.

## Method and hard constraints

- Research was performed by fetching specific official documentation URLs directly (no general web search engine is available in this environment).
- Instagram's Help Center page for photo resolution rendered as static, extractable content and was successfully read in full.
- WhatsApp's FAQ page, Facebook's Business Help Center page, and TikTok's Support Center page are all JavaScript-rendered single-page applications. Fetching them returned only client-side bootstrap/navigation data, not the actual help-article text. Their technical content could not be extracted through this tool.
- No test Instagram, Facebook, WhatsApp, or TikTok accounts, official upload/publishing API credentials, or Creator API access exist in this environment. No live upload experiment was performed against any platform in this session.
- No native tooling for VMAF/PSNR/SSIM video-quality measurement is installed in this environment.

## Verified facts (with source)

| Platform | Feature | Current behavior | Official source | Date checked | Confidence | Implementation consequence |
| --- | --- | --- | --- | --- | --- | --- |
| Instagram | Photo resolution (upload) | Instagram uploads at up to 1080px width. A photo with width between 320 and 1080px is kept at its original resolution if its aspect ratio is between 1.91:1 and 3:4 (1080px width -> height between 566 and 1440px). Photos outside that ratio are cropped. Photos narrower than 320px are enlarged to 320px. Photos wider than 1080px are downsized to 1080px. | https://help.instagram.com/1631821640426723 | 2026-09-01 | High (primary official source, full text retrieved) | Instagram's image profile now enforces this exact rule: recommend width 320-1080px and aspect ratio 1.91:1-3:4; only resize when the source falls outside that window, and only once. |
| WhatsApp | Media sending / HD quality | HD/quality media sending availability varies by app version, network conditions, and user settings. No exact numeric bitrate/resolution table was available in the retrievable text. | https://faq.whatsapp.com/iphone/chats/how-to-send-media/ | 2026-09-01 (previously fetched; not re-extractable this session) | Medium (page exists and the general claim was previously read, but full technical detail could not be re-confirmed this session) | WhatsApp video/image profiles keep all numeric fields UNKNOWN; only the general HD-variability note is used in UI copy. |

## Not verified (confirmed inaccessible this session)

| Platform | What was sought | What happened |
| --- | --- | --- |
| Facebook | Feed/Story/Reel video and image technical specifications | `https://www.facebook.com/business/help/939929289862953` redirected to a login-gated `web.facebook.com` URL; content extraction failed both times. |
| WhatsApp | Exact HD video resolution/bitrate ceiling, Status/Profile image specifications | FAQ page returned only client-side bootstrap JSON, no article text. |
| TikTok | Video/photo-post technical specifications (resolution, bitrate, codec, duration limits) | Support Center "Creating videos" page returned only navigation links, no article body text. |

## Third-party "HD status" / "no compression" tool research

Not performed. This would require obtaining, installing, and forensically analyzing third-party applications (FFprobe/image-header inspection of their real output files), which was out of scope for what could be done via direct URL fetches, and no such tools or their output samples were available in this environment. This is recorded here rather than invented; see `docs/SOCIAL_MEDIA_COMPRESSION_RESEARCH.md` for the same conclusion applied to the compression-research task specifically.

## Live platform upload testing

Not performed. No test accounts, official upload APIs, or Creator API credentials exist in this environment, and creating throwaway accounts on production social platforms to conduct upload experiments was not attempted, consistent with not fabricating platform-account-dependent claims. Where a genuinely real, user-operable comparison is valuable, VUNGA FURY now provides a local **Social Media Test Lab** (see `SOCIAL_MEDIA_OPTIMIZER.md`) so a human operator can run the real upload manually, retrieve the platform's own output, and get an objective local comparison against the original — without this application ever contacting any platform server itself.

## What this means for the implementation

- Only the Instagram photo-resolution rule above is enforced as a genuine, sourced numeric rule.
- Every other platform/media-type numeric specification remains `UNKNOWN` in the platform profiles, per project policy: never invent a bitrate, resolution, codec, or compression level that was not verified.
- The application does not claim to bypass, disable, or control platform-side server processing for any platform. It optimizes the input before upload and, where a destination is genuinely unsupported or unverified, says so plainly.
