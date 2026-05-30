import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/admin/guard'
import { getLeadDetail } from '@/lib/admin/queries'
import { getStatus, formatExpiresAt } from '@/bot/services/promocode-service'
import { CLUSTER_LABEL } from '@/bot/flows/quiz-questions'
import { LEAD_STATUS_BADGE, LEAD_STATUS_LABEL, fmtMinsk } from '@/lib/admin/labels'
import { Section } from '@/components/admin/charts'
import LeadActions from '@/components/admin/LeadActions'

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage()
  const { id } = await params
  const detail = await getLeadDetail(Number(id))
  if (!detail) notFound()

  const { lead, user, promocode, answers } = detail
  const pcStatus = getStatus(promocode)
  const canRedeem = pcStatus.kind === 'active' || pcStatus.kind === 'expired'

  const sv = lead.scoreVector ?? { web: 0, bot: 0, miniapp: 0, ai: 0 }
  const svTotal = sv.web + sv.bot + sv.miniapp + sv.ai || 1
  const p = (n: number) => Math.round((n / svTotal) * 100)

  return (
    <div className="space-y-4">
      <Link href="/admin/leads" className="text-sm text-indigo-300">
        ← К лидам
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Лид #{lead.id}</h1>
        <span className={`rounded px-2 py-0.5 text-xs ${LEAD_STATUS_BADGE[lead.status] ?? ''}`}>
          {LEAD_STATUS_LABEL[lead.status] ?? lead.status}
        </span>
      </div>

      {/* Контакт */}
      <Section title="Контакт">
        <div className="space-y-1 text-sm">
          <div>{user?.firstName ?? '—'}</div>
          <div className="text-white/60">
            {user?.tgUsername ? '@' + user.tgUsername : 'без username'} · id {user?.tgUserId}
          </div>
          {user && (
            <a href={`tg://user?id=${user.tgUserId}`} className="inline-block text-indigo-300">
              Открыть чат в Telegram →
            </a>
          )}
          <div className="pt-1 text-[11px] text-white/40">
            создан {fmtMinsk(lead.createdAt)} · источник {lead.utmCluster ?? '—'} / {lead.utmSection ?? '—'}
          </div>
        </div>
      </Section>

      {/* Классификация */}
      <Section title="Классификация">
        <div className="text-sm">
          {lead.cluster ? CLUSTER_LABEL[lead.cluster] : '—'}{' '}
          <span className="text-white/40">({p(lead.cluster ? sv[lead.cluster] : 0)}%)</span>
        </div>
        <div className="mt-1 text-[11px] text-white/45">
          web {p(sv.web)}% · bot {p(sv.bot)}% · miniapp {p(sv.miniapp)}% · ai {p(sv.ai)}%
        </div>
      </Section>

      {/* Ответы квиза */}
      {answers.length > 0 && (
        <Section title="Ответы квиза">
          <ul className="space-y-1.5 text-sm">
            {answers.map((a, i) => (
              <li key={i}>
                <div className="text-white/55">{a.questionText}</div>
                <div className="text-white/90">{a.answerLabel}</div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Промокод */}
      {promocode && (
        <Section title="Промокод">
          <div className="text-sm">
            <code className="text-white">{promocode.code}</code> · {promocode.discountPct}%
          </div>
          <div className="mt-1 text-[11px] text-white/45">
            {pcStatus.kind === 'redeemed'
              ? `погашен ${promocode.redeemedAt ? formatExpiresAt(promocode.redeemedAt) : ''}`
              : pcStatus.kind === 'expired'
                ? `истёк ${formatExpiresAt(promocode.expiresAt)}`
                : `активен до ${formatExpiresAt(promocode.expiresAt)}`}
            {promocode.redeemedNote ? ` · ${promocode.redeemedNote}` : ''}
          </div>
        </Section>
      )}

      {/* AI-резюме */}
      {lead.reportText && (
        <Section title={`AI-резюме (${lead.reportSource ?? 'fallback'})`}>
          <p className="whitespace-pre-wrap text-sm text-white/80">{lead.reportText}</p>
        </Section>
      )}

      {/* Действия */}
      <Section title="Действия">
        <LeadActions
          leadId={lead.id}
          currentStatus={lead.status}
          tgUserId={user?.tgUserId ?? 0}
          canRedeem={canRedeem}
        />
      </Section>
    </div>
  )
}
