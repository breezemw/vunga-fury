import type { SocialDestinationProfile } from '../common/platformTypes'

export function describeWhatsAppOrientationRule(destination: SocialDestinationProfile): string | null {
  if (destination.orientation !== 'vertical') return null
  return 'WhatsApp Status updates are designed for vertical, full-screen playback. Landscape or square video will still send, but may be displayed with letterboxing.'
}

export function describeWhatsAppDocumentModeNote(): string {
  return 'Sending a file as a "Document" in WhatsApp (instead of as media) can avoid WhatsApp\'s own media re-compression. This is a sending choice made inside WhatsApp; VUNGA FURY only prepares the file locally and cannot change how WhatsApp transmits it.'
}
