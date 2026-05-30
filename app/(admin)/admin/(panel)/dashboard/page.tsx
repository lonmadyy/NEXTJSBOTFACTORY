import { requireAdminPage } from '@/lib/admin/guard'
import { getDashboardData } from '@/lib/admin/analytics'
import { BarList, Funnel, Kpi, Section, TimeSeries, pct } from '@/components/admin/charts'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  new: 'Новые',
  contacted: 'В работе',
  won: 'Сделки',
  lost: 'Потеряны',
  archived: 'Архив',
}

export default async function DashboardPage() {
  await requireAdminPage()
  const d = await getDashboardData()

  const statusItems = Object.entries(d.leads.byStatus).map(([k, v]) => ({
    label: STATUS_LABEL[k] ?? k,
    value: v,
  }))

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Обзор</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-2">
        <Kpi label="Пользователи" value={d.users.total} sub={`+${d.users.new7} за 7 дней`} />
        <Kpi
          label="Лиды"
          value={d.leads.total}
          sub={`${d.leads.won} сделок · ${pct(d.leads.won, d.leads.total)} win`}
          accent="text-emerald-400"
        />
        <Kpi
          label="Завершаемость квиза"
          value={pct(d.quiz.usersCompleted, d.quiz.usersStarted)}
          sub={`${d.quiz.usersCompleted} из ${d.quiz.usersStarted}`}
        />
        <Kpi
          label="Промокоды"
          value={`${d.promo.redeemed}/${d.promo.issued}`}
          sub={`погашено ${pct(d.promo.redeemed, d.promo.issued)}`}
        />
      </div>

      <Section title="Динамика (30 дней)">
        <TimeSeries data={d.series} />
      </Section>

      <Section title="Воронка">
        <Funnel steps={d.funnel} />
      </Section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Section title="Лиды по статусам">
          <BarList items={statusItems} />
        </Section>
        <Section title="Кластеры услуг">
          <BarList items={d.clusters.map((c) => ({ label: c.label, value: c.value }))} />
        </Section>
      </div>

      <Section title="Источники (UTM-кластер)">
        <BarList items={d.utm.map((u) => ({ label: u.key, value: u.value }))} />
      </Section>

      {(d.users.blocked > 0 || d.users.unsub > 0) && (
        <p className="px-1 text-xs text-white/40">
          Заблокировали бота: {d.users.blocked} · отписались: {d.users.unsub}
        </p>
      )}
    </div>
  )
}
