'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/admin/dashboard', label: 'Обзор', icon: '📊' },
  { href: '/admin/leads', label: 'Лиды', icon: '🎯' },
  { href: '/admin/users', label: 'Юзеры', icon: '👥' },
  { href: '/admin/broadcasts', label: 'Рассылки', icon: '📣' },
] as const

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0b0f]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-stretch justify-around">
        {ITEMS.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + '/')
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                active ? 'text-white' : 'text-white/45 hover:text-white/70'
              }`}
            >
              <span className="text-lg leading-none">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
