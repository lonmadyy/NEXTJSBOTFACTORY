import type { ServiceKind } from '@/components/services/servicesData'

export default function ServiceMockupDesktop({
  kind,
  title,
}: {
  kind: ServiceKind
  title: string
}) {
  if (kind === 'web') {
    return (
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04]">
          <div className="flex items-center gap-1.5 border-b border-white/10 p-3">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            <span className="h-2 w-2 rounded-full bg-[#facc15]" />
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
            <div className="ml-2 h-6 flex-1 rounded-full border border-white/10 bg-black/40 px-3">
              <span className="font-manrope text-[10px] leading-6 text-white/45">
                /{title.toLowerCase().replace(' ', '-')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-2 p-3">
            <div className="col-span-3 space-y-2">
              <div className="h-6 rounded-md bg-white/10" />
              <div className="h-16 rounded-md bg-white/5" />
              <div className="h-16 rounded-md bg-white/5" />
            </div>
            <div className="col-span-9 space-y-2">
              <div className="h-8 rounded-md bg-white/15" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 rounded-md bg-white/10" />
                <div className="h-16 rounded-md bg-white/10" />
              </div>
              <div className="h-20 rounded-md bg-gradient-to-r from-blue-500/40 to-cyan-400/30" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'bot') {
    return (
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22c55e]/25 text-sm font-bold text-[#86efac]">
              B
            </div>
            <div>
              <p className="font-manrope text-xs uppercase tracking-[0.14em] text-white/55">
                Telegram bot
              </p>
              <p className="font-syne text-sm uppercase text-white">{title}</p>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="w-[78%] rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 font-manrope text-xs text-white/80">
              Запускаю квиз и подбираю тариф
            </div>
            <div className="ml-auto w-[72%] rounded-2xl rounded-br-sm bg-[#22c55e]/25 px-3 py-2 text-right font-manrope text-xs text-[#dcfce7]">
              Нужен бот для заявок и CRM
            </div>
            <div className="w-[82%] rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2 font-manrope text-xs text-white/80">
              Готово. Сценарий + интеграции + аналитика
            </div>
          </div>
          <div className="mt-4 rounded-full border border-white/10 bg-black/40 px-4 py-2">
            <p className="font-manrope text-[11px] uppercase tracking-[0.15em] text-white/45">
              message...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'mini') {
    return (
      <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.26),transparent_42%),radial-gradient(circle_at_18%_78%,rgba(59,130,246,0.2),transparent_44%)]" />
        <div className="relative mx-auto h-full w-[71%] rounded-[2rem] border border-white/15 bg-[#080808] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-6 w-20 rounded-full bg-white/10" />
            <div className="h-5 w-5 rounded-full border border-fuchsia-300/35 bg-fuchsia-400/20" />
          </div>

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-fuchsia-500/25 blur-xl" />
            <p className="font-manrope text-[9px] uppercase tracking-[0.15em] text-white/50">
              Mini app event
            </p>
            <h4 className="mt-1 font-syne text-sm uppercase text-white">Flash Drop</h4>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-manrope text-xs text-white/80">TWA Storefront</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-manrope text-[9px] uppercase text-fuchsia-200">
                Live
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <div className="h-10 rounded-md bg-gradient-to-br from-purple-500/35 to-fuchsia-400/30" />
              <div className="mt-1 h-2.5 w-10 rounded bg-white/20" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <div className="h-10 rounded-md bg-gradient-to-br from-indigo-500/30 to-blue-400/30" />
              <div className="mt-1 h-2.5 w-12 rounded bg-white/20" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-8 rounded-md border border-white/10 bg-white/10" />
            <div className="h-8 rounded-md border border-white/10 bg-white/10" />
            <div className="h-8 rounded-md border border-white/10 bg-white/10" />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-xl border border-white/10 bg-black/50 p-2">
            <div className="h-5 rounded bg-white/10" />
            <div className="h-5 rounded bg-white/10" />
            <div className="h-5 rounded bg-fuchsia-400/25" />
            <div className="h-5 rounded bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(251,146,60,0.22),transparent_40%),radial-gradient(circle_at_62%_62%,rgba(239,68,68,0.18),transparent_48%)]" />

        <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/15 animate-[spin_14s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 animate-[spin_10s_linear_infinite_reverse]" />

        <div className="absolute left-[18%] top-[28%] h-3 w-3 rounded-full bg-orange-300/90 shadow-[0_0_14px_rgba(253,186,116,0.7)]" />
        <div className="absolute right-[20%] top-[30%] h-3 w-3 rounded-full bg-red-300/90 shadow-[0_0_14px_rgba(252,165,165,0.7)]" />
        <div className="absolute left-[24%] bottom-[26%] h-3 w-3 rounded-full bg-white/85 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <div className="absolute right-[22%] bottom-[23%] h-3 w-3 rounded-full bg-orange-200/90 shadow-[0_0_12px_rgba(254,215,170,0.7)]" />

        <div className="absolute left-[21%] top-[30%] h-px w-[58%] bg-gradient-to-r from-orange-400/0 via-orange-300/70 to-orange-400/0" />
        <div className="absolute left-[25%] bottom-[26%] h-px w-[53%] bg-gradient-to-r from-white/0 via-white/55 to-white/0" />
        <div className="absolute left-[25%] top-[30%] h-[44%] w-px bg-gradient-to-b from-white/0 via-white/45 to-white/0" />
        <div className="absolute right-[22%] top-[30%] h-[50%] w-px bg-gradient-to-b from-red-300/0 via-red-300/70 to-red-300/0" />

        <div className="absolute left-1/2 top-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm">
          <p className="font-manrope text-[10px] uppercase tracking-[0.16em] text-white/45">
            AI pipeline
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <div className="rounded border border-white/10 bg-white/10 px-1.5 py-1 text-center font-manrope text-[9px] uppercase text-white/80">
              GPT
            </div>
            <div className="rounded border border-white/10 bg-white/10 px-1.5 py-1 text-center font-manrope text-[9px] uppercase text-white/80">
              Vision
            </div>
            <div className="rounded border border-orange-300/35 bg-orange-400/20 px-1.5 py-1 text-center font-manrope text-[9px] uppercase text-orange-100">
              Agent
            </div>
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="h-2 rounded bg-white/15" />
            <div className="h-2 w-[88%] rounded bg-white/10" />
            <div className="h-2 w-[70%] rounded bg-gradient-to-r from-orange-400/45 to-red-400/45" />
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-orange-300 to-red-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
