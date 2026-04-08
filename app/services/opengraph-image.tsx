import { createSocialImage, socialContentType, socialImageSize } from '@/lib/og'

export const alt = 'Услуги BOT FACTORY в Минске'
export const size = socialImageSize
export const contentType = socialContentType
export const runtime = 'edge'

export default function ServicesOpenGraphImage() {
  return createSocialImage({
    eyebrow: 'Service Hub',
    title: 'Выберите формат digital-решения',
    description:
      'Сравните web-разработку, Telegram-ботов, Mini Apps и AI-интеграции, чтобы выбрать подходящий формат под вашу задачу.',
    accentFrom: '#4F46E5',
    accentTo: '#10B981',
  })
}
