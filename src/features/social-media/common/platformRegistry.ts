import type { SocialPlatformKey } from './platformTypes'
import type { SocialPlatformModule } from './socialOptimizer'

/** Loader map used to lazy-load one platform module only when it is selected. */
export const SOCIAL_PLATFORM_LOADERS: Record<
  SocialPlatformKey,
  () => Promise<SocialPlatformModule>
> = {
  facebook: () => import('../facebook/FacebookVideoOptimizer'),
  instagram: () => import('../instagram/InstagramVideoOptimizer'),
  tiktok: () => import('../tiktok/TikTokVideoOptimizer'),
  whatsapp: () => import('../whatsapp/WhatsAppVideoOptimizer'),
}
