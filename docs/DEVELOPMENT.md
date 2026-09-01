# Development

## Prerequisites

- Node.js compatible with the project dependencies
- npm

## Commands

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

The app is deployable as static output from `dist/` after a successful build. `npm run test` excludes Playwright specs and runs the unit/integration suites; `npm run test:e2e` runs Playwright separately.

The local storage layer is tested with `fake-indexeddb`; no database service is required. It validates fresh database setup, v1-to-v2 migration, persisted settings/history, expiry cleanup, unavailable storage fallback, low-storage classification, and clear-data deletion.

`npm run test` runs unit and integration tests. `npm run test:e2e` runs isolated Playwright Chromium desktop/mobile tests. Stage 13 installs the development-only `ffmpeg-static` package to generate small, reproducible local media fixtures under `tests/fixtures/generated`; the application never uses this test binary.
