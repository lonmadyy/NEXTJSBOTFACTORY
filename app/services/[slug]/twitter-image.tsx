import { notFound } from 'next/navigation'
import { createSocialImage, getServiceImageTheme, socialContentType, socialImageSize } from '@/lib/og'
import { serviceLandings } from '@/lib/site'

export const alt = 'Превью услуги BOT FACTORY'
export const size = socialImageSize
export const contentType = socialContentType
export const runtime = 'edge'

type ImageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ServiceTwitterImage({ params }: ImageProps) {
  const { slug } = await params
  const service = serviceLandings.find((item) => item.slug === slug)

  if (!service) {
    notFound()
  }

  const theme = getServiceImageTheme(service.slug)

  return createSocialImage({
    eyebrow: theme.eyebrow,
    title: service.title,
    description: service.description,
    accentFrom: theme.accentFrom,
    accentTo: theme.accentTo,
  })
}
