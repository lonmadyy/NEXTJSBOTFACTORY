'use client'

import Script from 'next/script'
import { useConsent } from './ConsentContext'

// Yandex Metrika counter loader. Поведение зеркалит GoogleAnalytics:
//   - грузится только после согласия в CookieConsent (status === 'granted'),
//   - тихо отключается если NEXT_PUBLIC_YANDEX_METRIKA_ID не задан.
// Счётчик создаётся в metrika.yandex.by (тип «Веб-сайт»), номер счётчика
// (например 12345678) кладётся в env как NEXT_PUBLIC_YANDEX_METRIKA_ID.
// Цели типа «JavaScript-событие» с именами bot_click / sticky_cta_click /
// sticky_cta_view создаются вручную в кабинете — имя цели совпадает с именем
// события в trackEvent().
export default function YandexMetrika() {
  const { status } = useConsent()
  const ymId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

  if (!ymId) return null
  if (status !== 'granted') return null

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${ymId}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${ymId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
