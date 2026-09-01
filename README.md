# VUNGA FURY

VUNGA FURY is a private, lossless-first video optimizer for preparing social-media uploads. The intended workflow keeps supported video processing in the browser, without accounts, remote video storage, or default server uploads.

## Status

The local workflow is implemented and tested in Chromium for supported H.264/AAC files: select a video, analyze it locally, choose lossless stream-copy optimization or Smart Conversion, verify the output, and download it. The project is not fully device-certified; see [docs/SESSION_STATUS.md](docs/SESSION_STATUS.md) for exact limits.

## Technology

- React 19, TypeScript with strict checks, and Vite
- Tailwind CSS v4
- No backend or browser-exposed secrets
- ESLint, Prettier, Vitest, and Playwright foundations

## Routes

- `/` - local file selection, analysis, preview, and metadata
- `/optimizer` - local lossless optimization, Smart Conversion, verification, and download
- `/analyzer` - local technical inspection
- `/settings` - persisted dark, light, system, cleanup, history, and storage controls
- `/about` - purpose, privacy, compatibility, and limitation details

## Development

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
npm run preview
```

## Privacy And Limitations

VUNGA FURY does not and will not guarantee that an upload destination avoids server-side re-encoding. Lossless optimization uses stream copying only for eligible streams and reports verification results honestly. Smart Conversion explicitly re-encodes. Neither controls a destination platform's final processing.

## Documentation

- `docs/ARCHITECTURE.md`
- `docs/VIDEO_PROCESSING.md`
- `docs/BROWSER_SUPPORT.md`
- `docs/PERFORMANCE.md`
- `docs/PRIVACY.md`
- `docs/DEVELOPMENT.md`
- `docs/REQUIREMENTS.md`
- `docs/SESSION_STATUS.md`
- `docs/SECURITY.md`

## Deployment

The repository includes a GitHub Pages workflow. Push the `main` branch, then enable Pages with GitHub Actions as the source. The deployment workflow builds with the correct project base path and includes an SPA fallback.

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
git add .
git commit -m "Deploy VUNGA FURY"
git push -u origin main
```

## License

License selection is pending. Do not redistribute this project until an explicit license is added.
