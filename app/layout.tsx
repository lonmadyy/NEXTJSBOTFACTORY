import type { Metadata } from 'next'
import { Manrope, Syne } from 'next/font/google' // Premium Tech Fonts
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd'
import { primaryKeywords, siteConfig } from '@/lib/site'
import './globals.css'

// Font Configuration
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultTitle,
    template: '%s | BOT FACTORY',
  },
  description: siteConfig.description,
  keywords: [...primaryKeywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'geo.region': 'BY-HM',
    'geo.placename': siteConfig.city,
    'geo.position': '53.9045;27.5615',
    ICBM: '53.9045, 27.5615',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${syne.variable} ${manrope.variable}`}>
      <body className="bg-[#050505] text-white antialiased selection:bg-[#4F46E5] selection:text-white">
        <OrganizationJsonLd />
        <main className="relative min-h-screen w-full overflow-x-hidden">{children}</main>
      </body>
    </html>
  )
}
