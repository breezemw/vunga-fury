import { AboutPage } from '../pages/AboutPage'
import { AnalyzerPage } from '../pages/AnalyzerPage'
import { HomePage } from '../pages/HomePage'
import { OptimizerPage } from '../pages/OptimizerPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SocialPage } from '../pages/SocialPage'

export const routes = [
  { path: '/', label: 'Optimizer', component: HomePage },
  { path: '/optimizer', label: 'Optimizer', component: OptimizerPage },
  { path: '/analyzer', label: 'Analyzer', component: AnalyzerPage },
  { path: '/social', label: 'Social', component: SocialPage },
  { path: '/settings', label: 'Settings', component: SettingsPage },
  { path: '/about', label: 'About', component: AboutPage },
] as const
