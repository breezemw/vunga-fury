# Browser Support

The application will use progressive enhancement rather than browser-name allowlists. Future processing support depends on WebAssembly, Web Workers, Blob and File APIs, compatible codecs, available memory, and browser storage.

Safari and constrained mobile devices may have lower practical file-size limits. VUNGA FURY will surface detected limitations rather than claim universal support. Smart Conversion depends on FFmpeg.wasm's available H.264 and AAC encoders, browser memory, and sufficient worker capacity. A conversion may fail on a constrained device or with an unusual input stream; it will report an error rather than silently use another profile.

## Stage 11 QA

The integrated Chromium browser completed responsive checks at 320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, and 1920 pixels across all five routes. Every route rendered one page heading and had no horizontal overflow at those widths.

At 390 pixels, the visible file-selection control opened the native file chooser, custom radio controls worked with the keyboard, the skip link moved focus to main content, and mobile navigation opened and closed with Escape. The app was also checked with `prefers-reduced-motion: reduce` emulated. Custom radio cards now show a focus-within outline; primary buttons and mobile navigation targets are at least 44 pixels high.

These are Chromium viewport emulations, not physical-device tests. iPhone Safari, Android Chrome, iPad, Android tablet, Firefox, Safari desktop, Edge, Windows, and Linux browsers were not available in this environment. File selection was tested, but real mobile video preview, processing memory behavior, output download, and large-video results need physical-device testing with representative files.

The optional PWA shell was tested in production preview on integrated Chromium: it registered a service worker and served a previously loaded route offline. Full offline FFmpeg initialization and media processing were not tested and are not guaranteed.
