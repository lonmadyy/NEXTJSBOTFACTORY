import { siteConfig } from '@/lib/site'

export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    '',
    '> Премиальная разработка сайтов, Telegram-ботов, Mini Apps и AI-решений для бизнеса в Минске и по Беларуси.',
    '',
    `Сайт: ${siteConfig.url}`,
    `Подробно: ${siteConfig.url}/llms-full.txt`,
    `Контакт: ${siteConfig.email}`,
    `Telegram: ${siteConfig.telegramUrl}`,
    '',
    '## О проекте',
    '',
    'BOT FACTORY проектирует и запускает коммерческие сайты, Telegram-ботов, Mini Apps и AI-интеграции для бизнеса.',
    '',
    '## Ключевая информация',
    '',
    '- Стоимость простых проектов: от 680 BYN',
    '- Сложные проекты с интеграциями: от 1960 BYN',
    '- Сроки: до 1 недели для простых задач, до 3 недель для сложных',
    '- Гарантия на работы: 2 месяца',
    `- Юридическое лицо: ${siteConfig.legalName}`,
    `- УНП: ${siteConfig.unp}`,
    '',
    '## Основные страницы',
    '',
    `- Главная: ${siteConfig.url}/`,
    `- Услуги: ${siteConfig.url}/services`,
    `- Расширенная версия для AI: ${siteConfig.url}/llms-full.txt`,
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
