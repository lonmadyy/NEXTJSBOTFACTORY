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
      'Р’С‹СЃРѕРєРѕРїСЂРѕРёР·РІРѕРґРёС‚РµР»СЊРЅС‹Рµ РєРѕСЂРїРѕСЂР°С‚РёРІРЅС‹Рµ СЃР°Р№С‚С‹, Р»РµРЅРґРёРЅРіРё Рё РїР»Р°С‚С„РѕСЂРјС‹ РґР»СЏ Р±РёР·РЅРµСЃР° РІ РњРёРЅСЃРєРµ Рё РїРѕ РІСЃРµР№ Р‘РµР»Р°СЂСѓСЃРё.',
    color: 'from-blue-600 to-cyan-400',
    tech: ['Next.js', 'React', 'Fullstack', 'SEO'],
    href: '/services/web-development-minsk',
    mockup: 'web',
  },
  {
    id: '02',
    title: 'Telegram Bots',
    description:
      'РЈРјРЅС‹Рµ Р±РѕС‚С‹ РґР»СЏ РїСЂРѕРґР°Р¶, РїРѕРґРґРµСЂР¶РєРё Рё Р°РІС‚РѕРјР°С‚РёР·Р°С†РёРё Р±РёР·РЅРµСЃР° СЃ РјСѓР»СЊС‚РёСЏР·С‹С‡РЅРѕСЃС‚СЊСЋ, РіР»СѓР±РѕРєРѕР№ Р°РЅР°Р»РёС‚РёРєРѕР№ Рё РїР»Р°С‚РµР¶РЅС‹РјРё РёРЅС‚РµРіСЂР°С†РёСЏРјРё.',
    color: 'from-emerald-500 to-green-300',
    tech: ['Python', 'Node.js', 'PostgreSQL', 'Payment API'],
    href: '/services/telegram-bots-minsk',
    mockup: 'bot',
  },
  {
    id: '03',
    title: 'Mini Apps',
    description:
      'РџРѕР»РЅРѕС†РµРЅРЅС‹Рµ РІРµР±-РїСЂРёР»РѕР¶РµРЅРёСЏ РІРЅСѓС‚СЂРё Telegram: e-commerce, crypto/Web3 Рё РёРЅС‚РµСЂР°РєС‚РёРІРЅС‹Рµ РёРіСЂС‹ СЃ РЅР°С‚РёРІРЅС‹Рј UX/UI.',
    color: 'from-purple-600 to-pink-400',
    tech: ['Frontend', 'Backend', 'Telegram', 'WebGL'],
    href: '/services/mini-apps-minsk',
    mockup: 'mini',
  },
  {
    id: '04',
    title: 'AI Integration',
    description:
      'Р’РЅРµРґСЂРµРЅРёРµ GPT, Machine Learning Рё РіРµРЅРµСЂР°С†РёРё РёР·РѕР±СЂР°Р¶РµРЅРёР№. РљР°СЃС‚РѕРјРЅС‹Рµ AI-РїРµСЂСЃРѕРЅР°Р¶Рё РґР»СЏ РїРѕРґРґРµСЂР¶РєРё РєР»РёРµРЅС‚РѕРІ Рё Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРѕРіРѕ СЃРѕР·РґР°РЅРёСЏ РєРѕРЅС‚РµРЅС‚Р°.',
    color: 'from-orange-500 to-red-400',
    tech: ['OpenAI', 'PyTorch', 'Stable Diffusion', 'LLM'],
    href: '/services/ai-integration-minsk',
    mockup: 'ai',
  },
]
