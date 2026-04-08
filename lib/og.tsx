import { ImageResponse } from 'next/og'
import type { ServiceLanding } from '@/lib/site'

export const socialImageSize = {
  width: 1200,
  height: 630,
}

export const socialContentType = 'image/png'

type SocialImageProps = {
  eyebrow: string
  title: string
  description: string
  accentFrom: string
  accentTo: string
}

type ServiceTheme = {
  eyebrow: string
  accentFrom: string
  accentTo: string
}

const serviceThemes: Record<ServiceLanding['slug'], ServiceTheme> = {
  'web-development-minsk': {
    eyebrow: 'Web Development',
    accentFrom: '#4F46E5',
    accentTo: '#06B6D4',
  },
  'telegram-bots-minsk': {
    eyebrow: 'Telegram Bots',
    accentFrom: '#10B981',
    accentTo: '#84CC16',
  },
  'mini-apps-minsk': {
    eyebrow: 'Telegram Mini Apps',
    accentFrom: '#7C3AED',
    accentTo: '#EC4899',
  },
  'ai-integration-minsk': {
    eyebrow: 'AI Integration',
    accentFrom: '#F97316',
    accentTo: '#EF4444',
  },
}

export function getServiceImageTheme(slug: ServiceLanding['slug']): ServiceTheme {
  return serviceThemes[slug]
}

export function createSocialImage({
  eyebrow,
  title,
  description,
  accentFrom,
  accentTo,
}: SocialImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#050505',
          color: '#FFFFFF',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 32%), radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent 30%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -120,
            top: -180,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
            opacity: 0.18,
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -110,
            bottom: -190,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: `linear-gradient(135deg, ${accentTo}, ${accentFrom})`,
            opacity: 0.2,
            filter: 'blur(40px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 34,
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(0,0,0,0.34)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '56px 62px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              BOT FACTORY
            </div>
            <div
              style={{
                display: 'flex',
                padding: '10px 16px',
                borderRadius: 9999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              Minsk / Belarus
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 920,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                padding: '10px 16px',
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 26,
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                maxWidth: 860,
                fontSize: 28,
                lineHeight: 1.35,
                color: 'rgba(255,255,255,0.78)',
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 230,
                height: 8,
                borderRadius: 9999,
                background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
              }}
            />
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.62)',
              }}
            >
              botfactory.by
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...socialImageSize,
    }
  )
}
