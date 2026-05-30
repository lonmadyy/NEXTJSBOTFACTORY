import { requireAdminPage } from '@/lib/admin/guard'

export const dynamic = 'force-dynamic'

// Плейсхолдер дашборда — наполняется аналитикой в Фазе 2.
export default async function DashboardPage() {
  const session = await requireAdminPage()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Обзор</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Авторизация работает. Admin ID: <code className="text-white">{session.adminId}</code>
        <br />
        Аналитика появится здесь на Фазе 2.
      </div>
    </div>
  )
}
