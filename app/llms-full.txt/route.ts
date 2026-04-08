import { homeFaq, serviceLandings, siteConfig } from '@/lib/site'

export function GET() {
  const lines = [
    `# ${siteConfig.name} — расширенная версия для AI`,
    '',
    '> BOT FACTORY — студия разработки сайтов, Telegram-ботов, Mini Apps и AI-интеграций для бизнеса в Минске и по Беларуси.',
    '',
    `Сайт: ${siteConfig.url}`,
    `Контакт: ${siteConfig.email}`,
    `Telegram: ${siteConfig.telegramUrl}`,
    `Юридическое лицо: ${siteConfig.legalName}`,
    `УНП: ${siteConfig.unp}`,
    '',
    '## Позиционирование',
    '',
    'BOT FACTORY делает премиальные digital-решения для бизнеса: коммерческие сайты, Telegram-ботов, Mini Apps и AI-автоматизацию.',
    '',
    '## Бизнес-факты',
    '',
    '- Стоимость простых проектов обычно начинается от 680 BYN.',
    '- Сложные решения с интеграциями и расширенной логикой обычно начинаются от 1960 BYN.',
    '- Простые проекты обычно выполняются до 1 недели.',
    '- Сложные проекты с несколькими интеграциями и нестандартной логикой обычно занимают до 3 недель.',
    '- Гарантия на выполненные работы — 2 месяца.',
    '- Все сроки, стоимость и гарантийные обязательства фиксируются в договоре.',
    '',
    '## Услуги',
    '',
    ...serviceLandings.flatMap((service) => [
      `### ${service.title}`,
      '',
      `URL: ${siteConfig.url}/services/${service.slug}`,
      `Описание: ${service.description}`,
      `Кратко: ${service.intro}`,
      'Ключевые тезисы:',
      ...service.bullets.map((bullet) => `- ${bullet}`),
      '',
    ]),
    '## FAQ',
    '',
    ...homeFaq.flatMap((item) => [
      `### ${item.question}`,
      item.answer,
      '',
    ]),
    '## Основные страницы',
    '',
    `- Главная: ${siteConfig.url}/`,
    `- Услуги: ${siteConfig.url}/services`,
    ...serviceLandings.map((service) => `- ${service.title}: ${siteConfig.url}/services/${service.slug}`),
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
