import type { Metadata } from 'next'
import AmbientOverlay from '@/components/layout/AmbientOverlay'
import HomeRuntimeShell from '@/components/layout/HomeRuntimeShell'
import Hero from '@/components/hero/Hero'
import TrustSection from '@/components/trust/TrustSection'
import ServicesSection from '@/components/services/ServicesSection'
import LocalSeoSection from '@/components/seo/LocalSeoSection'
import IntegrationsSection from '@/components/integrations/IntegrationsSection'
import ProcessSection from '@/components/process/ProcessSection'
import Footer from '@/components/layout/Footer'
import FaqSection from '@/components/seo/FaqSection'
import EeatSection from '@/components/seo/EeatSection'
import HomeStructuredData from '@/components/seo/HomeStructuredData'
import { primaryKeywords, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Разработка сайтов в Минске под ключ — сайты и Telegram-боты',
  description:
    'Разработка сайтов в Минске под ключ: лендинги, корпоративные сайты, Telegram-боты и AI-интеграции. Запуск за 1–3 недели, гарантия 2 месяца, договор. От 680 BYN.',
  keywords: [...primaryKeywords],
  alternates: {
    canonical: '/',
    languages: {
      'ru-BY': siteConfig.url,
      'x-default': siteConfig.url,
    },
  },
  openGraph: {
    title: 'Разработка сайтов в Минске под ключ — BOT FACTORY',
    description:
      'Создаём сайты и Telegram-ботов для бизнеса в Минске. Лендинги, корпоративные сайты, AI-интеграции. От 680 BYN, запуск за 1–3 недели.',
    url: siteConfig.url,
    locale: siteConfig.locale,
    type: 'website',
  },
}

export default function Home() {
  return (
    <HomeRuntimeShell>
      <HomeStructuredData />
      <AmbientOverlay />

      <div id="hero" className="relative z-10">
        <Hero />
      </div>
      <div className="relative z-10">
        <TrustSection />
      </div>
      <div className="relative z-10">
        <LocalSeoSection />
      </div>
      <div id="services" className="relative z-20">
        <ServicesSection />
      </div>
      <div id="integrations" className="relative z-10">
        <IntegrationsSection />
      </div>
      <div id="workflow" className="relative z-10">
        <ProcessSection />
      </div>
      <div className="relative z-10">
        <EeatSection />
      </div>
      <div className="relative z-10">
        <FaqSection />
      </div>
      <div id="contact" className="relative z-10">
        <Footer />
      </div>
    </HomeRuntimeShell>
  )
}
