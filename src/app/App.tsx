import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { FfmpegEngineProvider } from './providers/FfmpegEngineProvider'
import { LocalSettingsProvider } from './providers/LocalSettingsProvider'
import { VideoFileProvider } from './providers/VideoFileProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { AppRouter } from './routes'

function App() {
  return (
    <LocalSettingsProvider>
      <ThemeProvider>
        <FfmpegEngineProvider>
          <VideoFileProvider>
            <div className="min-h-screen bg-[var(--canvas)] text-[var(--text)]">
              <a
                href="#main-content"
                className="sr-only absolute left-4 top-4 z-50 bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[#182000] focus:not-sr-only"
              >
                Skip to main content
              </a>
              <Header />
              <main id="main-content" tabIndex={-1}>
                <AppRouter />
              </main>
              <Footer />
            </div>
          </VideoFileProvider>
        </FfmpegEngineProvider>
      </ThemeProvider>
    </LocalSettingsProvider>
  )
}

export default App
