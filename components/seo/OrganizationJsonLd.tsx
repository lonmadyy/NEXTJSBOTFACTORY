import { serviceLandings, siteConfig } from '@/lib/site'

export default function OrganizationJsonLd() {
  const organization = {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/icon-512.png`,
    priceRange: '680–9000 BYN',
    currenciesAccepted: 'BYN, USD, EUR, RUB',
    paymentAccepted: 'Bank transfer, ERIP, Cash',
    foundingDate: '2023',
    knowsLanguage: ['ru', 'be', 'en'],
    taxID: siteConfig.unp,
    areaServed: [
      {
        '@type': 'City',
        name: siteConfig.city,
      },
      {
        '@type': 'Country',
        name: siteConfig.country,
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Минская область',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.city,
      addressRegion: 'Минская область',
      addressCountry: 'BY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.9045,
      longitude: 27.5615,
    },
    hasMap: 'https://yandex.by/maps/157/minsk/',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    founder: {
      '@type': 'Person',
      name: siteConfig.founder,
      jobTitle: 'Основатель и руководитель разработки',
      worksFor: {
        '@id': `${siteConfig.url}#organization`,
      },
    },
    sameAs: [siteConfig.telegramUrl, siteConfig.instagramUrl, siteConfig.linkedinUrl],
    makesOffer: serviceLandings.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        areaServed: {
          '@type': 'Country',
          name: siteConfig.country,
        },
      },
      priceCurrency: 'BYN',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/services/${service.slug}`,
    })),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phoneDisplay,
        contactType: 'sales',
        email: siteConfig.email,
        areaServed: 'BY',
        availableLanguage: ['ru', 'be', 'en'],
      },
    ],
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
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
