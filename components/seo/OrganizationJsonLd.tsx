import { serviceLandings, siteConfig } from '@/lib/site'

export default function OrganizationJsonLd() {
  const organization = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    areaServed: [
      {
        '@type': 'City',
        name: siteConfig.city,
      },
      {
        '@type': 'Country',
        name: siteConfig.country,
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.city,
      addressCountry: 'BY',
    },
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
    },
    sameAs: [siteConfig.telegramUrl, siteConfig.instagramUrl, siteConfig.linkedinUrl],
    makesOffer: serviceLandings.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
      },
    })),
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    alternateName: 'Bot Factory',
    description: siteConfig.description,
    inLanguage: 'ru-BY',
    publisher: {
      '@id': `${siteConfig.url}#organization`,
    },
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
