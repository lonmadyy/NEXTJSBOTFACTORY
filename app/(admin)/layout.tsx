import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import TgInit from '@/components/admin/TgInit'

export const metadata: Metadata = {
  title: 'BOT FACTORY — Админка',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0b0b0f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Корневой layout админ-зоны (вложен в app/layout.tsx). Подключает Telegram
// WebApp SDK и задаёт нейтральный тёмный фон под TMA.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root min-h-screen bg-[#0b0b0f] text-white">
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      <TgInit />
      {children}
    </div>
  )
}
