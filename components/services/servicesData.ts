export type ServiceKind = 'web' | 'bot' | 'mini' | 'ai'

export type ServiceItem = {
  id: string
  title: string
  description: string
  color: string
  tech: string[]
  href: string
  mockup: ServiceKind
}

export const services: ServiceItem[] = [
  {
    id: '01',
    title: 'Websites',
    description:
      'Высокопроизводительные корпоративные сайты, лендинги и платформы для бизнеса в Минске и по всей Беларуси.',
    color: 'from-blue-600 to-cyan-400',
    tech: ['Next.js', 'React', 'Fullstack', 'SEO'],
    href: '/services/web-development-minsk',
    mockup: 'web',
  },
  {
    id: '02',
    title: 'Telegram Bots',
    description:
      'Умные боты для продаж, поддержки и автоматизации бизнеса с мультиязычностью, глубокой аналитикой и платежными интеграциями.',
    color: 'from-emerald-500 to-green-300',
    tech: ['Python', 'Node.js', 'PostgreSQL', 'Payment API'],
    href: '/services/telegram-bots-minsk',
    mockup: 'bot',
  },
  {
    id: '03',
    title: 'Mini Apps',
    description:
      'Полноценные веб-приложения внутри Telegram: e-commerce, crypto/Web3 и интерактивные игры с нативным UX/UI.',
    color: 'from-purple-600 to-pink-400',
    tech: ['Frontend', 'Backend', 'Telegram', 'WebGL'],
    href: '/services/mini-apps-minsk',
    mockup: 'mini',
  },
  {
    id: '04',
    title: 'AI Integration',
    description:
      'Внедрение GPT, Machine Learning и генерации изображений. Кастомные AI-персонажи для поддержки клиентов и автоматического создания контента.',
    color: 'from-orange-500 to-red-400',
    tech: ['OpenAI', 'PyTorch', 'Stable Diffusion', 'LLM'],
    href: '/services/ai-integration-minsk',
    mockup: 'ai',
  },
]
