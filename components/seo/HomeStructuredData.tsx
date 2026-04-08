import { homeFaq, serviceLandings, siteConfig } from '@/lib/site'

export default function HomeStructuredData() {
  const serviceGraph = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Услуги BOT FACTORY',
    itemListElement: serviceLandings.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteConfig.url}/services/${service.slug}`,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        areaServed: `${siteConfig.city}, ${siteConfig.country}`,
      },
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceGraph) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

