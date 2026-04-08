import { notFound } from 'next/navigation'
import { createSocialImage, getServiceImageTheme, socialContentType, socialImageSize } from '@/lib/og'
import { serviceLandings } from '@/lib/site'

export const alt = 'Превью услуги BOT FACTORY'
export const size = socialImageSize
export const contentType = socialContentType
export const runtime = 'edge'

type ImageProps = {
  params: {
    slug: string
  }
}

export default function ServiceOpenGraphImage({ params }: ImageProps) {
  const service = serviceLandings.find((item) => item.slug === params.slug)

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
