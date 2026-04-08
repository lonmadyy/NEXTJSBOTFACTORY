import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServiceLandingTemplate from '@/components/seo/ServiceLandingTemplate'
import { serviceLandings, siteConfig } from '@/lib/site'

type Params = {
  params: Promise<{
    slug: string
  }>
}

const serviceMap = new Map(serviceLandings.map((item) => [item.slug, item]))
export const dynamicParams = false

export function generateStaticParams() {
  return serviceLandings.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = serviceMap.get(slug as (typeof serviceLandings)[number]['slug'])
  if (!service) {
    return {
      title: 'Услуга не найдена',
    }
  }

  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.h1,
      description: service.description,
      url: `${siteConfig.url}/services/${service.slug}`,
      type: 'website',
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: service.h1,
      description: service.description,
    },
  }
}

export default async function ServiceLandingPage({ params }: Params) {
  const { slug } = await params
  const service = serviceMap.get(slug as (typeof serviceLandings)[number]['slug'])
  if (!service) notFound()

  return <ServiceLandingTemplate service={service} />
}
