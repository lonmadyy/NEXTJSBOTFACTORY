import { requireAdminPage } from '@/lib/admin/guard'
import AdminNav from '@/components/admin/AdminNav'

export const dynamic = 'force-dynamic'

// Layout защищённой части админки: гард + контейнер + нижняя навигация.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage()
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-5">
      {children}
      <AdminNav />
    </div>
  )
}
