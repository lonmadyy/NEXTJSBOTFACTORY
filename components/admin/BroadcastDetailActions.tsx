'use client'
import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cancelBroadcastAction } from '@/lib/admin/broadcast-actions'

export default function BroadcastDetailActions({ id, status }: { id: number; status: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  // Пока идёт отправка — периодически обновляем страницу для прогресса.
  useEffect(() => {
    if (status !== 'sending') return
    const t = setInterval(() => router.refresh(), 4000)
    return () => clearInterval(t)
  }, [status, router])

  const canCancel = status === 'draft' || status === 'scheduled' || status === 'sending'
  if (!canCancel) return null

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await cancelBroadcastAction(id)
          router.refresh()
        })
      }
      className="rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
    >
      {status === 'sending' ? 'Остановить рассылку' : 'Отменить'}
    </button>
  )
}
