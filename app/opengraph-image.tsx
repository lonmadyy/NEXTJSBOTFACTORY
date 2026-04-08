import { createSocialImage, socialContentType, socialImageSize } from '@/lib/og'

export const alt = 'BOT FACTORY — разработка сайтов, Telegram-ботов и AI в Минске'
export const size = socialImageSize
export const contentType = socialContentType
export const runtime = 'edge'

export default function OpenGraphImage() {
  return createSocialImage({
    eyebrow: 'Digital Solutions',
    title: 'Сайты, Telegram-боты и AI для бизнеса',
    description:
      'BOT FACTORY проектирует digital-решения в Минске: web-разработка, Telegram automation, Mini Apps и AI-интеграции.',
    accentFrom: '#4F46E5',
    accentTo: '#06B6D4',
  })
}
