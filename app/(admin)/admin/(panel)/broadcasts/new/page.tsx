import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'
import BroadcastComposer from '@/components/admin/BroadcastComposer'

export const dynamic = 'force-dynamic'

export default async function NewBroadcastPage() {
  await requireAdminPage()
  return (
    <div className="space-y-4">
      <Link href="/admin/broadcasts" className="text-sm text-indigo-300">
        ← К рассылкам
      </Link>
      <h1 className="text-xl font-semibold tracking-tight">Новая рассылка</h1>
      <BroadcastComposer />
    </div>
  )
}
