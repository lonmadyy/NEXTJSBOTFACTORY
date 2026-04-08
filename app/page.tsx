import type { Metadata } from 'next'
import AmbientOverlay from '@/components/layout/AmbientOverlay'
import StickyTopNav from '@/components/layout/StickyTopNav'
import ScrollStoryline from '@/components/layout/ScrollStoryline'
import FloatingBotCta from '@/components/layout/FloatingBotCta'
import Hero from '@/components/hero/Hero'
import TrustSection from '@/components/trust/TrustSection'
import ServicesSection from '@/components/services/ServicesSection'
import ProofSection from '@/components/proof/ProofSection'
import IntegrationsSection from '@/components/integrations/IntegrationsSection'
import ProcessSection from '@/components/process/ProcessSection'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import FaqSection from '@/components/seo/FaqSection'
import EeatSection from '@/components/seo/EeatSection'
import HomeStructuredData from '@/components/seo/HomeStructuredData'
import { ScrollUiStateProvider } from '@/components/layout/ScrollUiStateProvider'
import { primaryKeywords, siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Заказать сайт в Минске, Telegram-бота и AI-решения',
  description:
    'BOT FACTORY: разработка сайтов в Минске, создание Telegram-ботов для бизнеса и внедрение AI в CRM, аналитику и автоматизацию процессов.',
  keywords: [...primaryKeywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Разработка сайтов и Telegram-ботов в Минске',
    description:
      'Закажите сайт в Минске или Telegram-бота для бизнеса. Также внедряем ИИ-чатботы, генеративный ИИ и AI-автоматизацию под бизнес-задачи.',
    url: siteConfig.url,
    locale: siteConfig.locale,
    type: 'website',
  },
}

export default function Home() {
  return (
    <ScrollUiStateProvider>
      <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-[#4F46E5] selection:text-white">
        <HomeStructuredData />
        <AmbientOverlay />
        <StickyTopNav />
        <ScrollStoryline />
        <FloatingBotCta />
        <CustomCursor />

        <div id="hero" className="relative z-10">
          <Hero />
        </div>
        <div className="relative z-10">
          <TrustSection />
        </div>
        <div id="services" className="relative z-20">
          <ServicesSection />
        </div>
        <div id="proof" className="relative z-10">
          <ProofSection />
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
      </div>
    </ScrollUiStateProvider>
  )
}
