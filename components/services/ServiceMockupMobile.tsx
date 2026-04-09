import type { ServiceKind } from '@/components/services/servicesData'

export default function ServiceMockupMobile({
  kind,
  title,
}: {
  kind: ServiceKind
  title: string
}) {
  if (kind === 'web') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#07090d] p-2.5">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-blue-500/24 via-cyan-400/16 to-transparent" />
        <div className="relative rounded-[0.95rem] border border-white/10 bg-black/35 p-2.5">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
            <span className="h-2 w-2 rounded-full bg-[#fb7185]" />
            <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
            <span className="h-2 w-2 rounded-full bg-[#34d399]" />
            <div className="ml-2 h-5 flex-1 rounded-full bg-white/[0.06]" />
          </div>

          <div className="mt-2.5 grid grid-cols-[0.82fr_1.18fr] gap-2">
            <div className="space-y-2">
              <div className="h-7 rounded-lg bg-white/[0.08]" />
              <div className="h-12 rounded-lg bg-white/[0.05]" />
              <div className="h-10 rounded-lg bg-white/[0.05]" />
            </div>

            <div className="space-y-2">
              <div className="overflow-hidden rounded-[0.95rem] border border-white/10 bg-gradient-to-br from-blue-500/28 to-cyan-400/20 p-2.5">
                <p className="font-manrope text-[9px] uppercase tracking-[0.14em] text-white/55">
                  landing page
                </p>
                <h4 className="mt-1 font-syne text-sm uppercase leading-none text-white">{title}</h4>
                <div className="mt-2.5 h-2 w-14 rounded-full bg-white/30" />
                <div className="mt-1.5 h-2 w-10 rounded-full bg-white/15" />
                <div className="mt-2.5 inline-flex rounded-full border border-white/15 bg-black/20 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.16em] text-white/80">
                  launch
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 rounded-lg bg-white/[0.07]" />
                <div className="h-9 rounded-lg bg-white/[0.07]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'bot') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#07110b] p-2.5">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-emerald-500/18 via-green-400/14 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[12.2rem] flex-col rounded-[1.35rem] border border-white/10 bg-[#0a0d0f] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/18 font-syne text-sm font-bold text-emerald-200">
              B
            </div>
            <div>
              <p className="font-manrope text-[9px] uppercase tracking-[0.16em] text-white/45">bot flow</p>
              <p className="font-syne text-xs uppercase text-white">{title}</p>
            </div>
          </div>

          <div className="flex-1 space-y-2 pt-3">
            <div className="w-fit max-w-[78%] self-start break-words rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.09] px-2.5 py-2 font-manrope text-[8.5px] leading-relaxed text-white/78">
              Launching the lead quiz and qualifying the request.
            </div>
            <div className="ml-auto w-fit max-w-[72%] self-end break-words rounded-2xl rounded-br-sm bg-emerald-400/18 px-2.5 py-2 text-right font-manrope text-[8.5px] leading-relaxed text-emerald-100">
              Need a bot for leads, CRM and payment logic.
            </div>
            <div className="w-fit max-w-[82%] self-start break-words rounded-2xl rounded-bl-sm border border-white/5 bg-white/[0.09] px-2.5 py-2 font-manrope text-[8.5px] leading-relaxed text-white/78">
              Scenario approved. Integrations, analytics and launch plan are ready.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'mini') {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0a0710] p-2.5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(99,102,241,0.14),transparent_32%),radial-gradient(circle_at_80%_18%,rgba(217,70,239,0.2),transparent_34%)]" />
        <div className="relative mx-auto flex h-full max-w-[10.9rem] flex-col rounded-[1.45rem] border border-white/10 bg-[#09090c] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between">
            <div className="mx-auto h-1.5 w-11 rounded-full bg-white/12" />
            <div className="absolute right-3 top-3 h-4.5 w-4.5 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/20" />
          </div>

          <div className="mt-2.5 rounded-[1rem] border border-white/10 bg-white/[0.04] p-2.5">
            <p className="font-manrope text-[8px] uppercase tracking-[0.16em] text-white/42">mini app</p>
            <h4 className="mt-1 font-syne text-sm uppercase text-white">Flash Drop</h4>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/30 to-blue-400/25 p-2">
                <div className="h-7 rounded-lg bg-white/10" />
                <div className="mt-2 h-1.5 w-7 rounded-full bg-white/20" />
              </div>
              <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-purple-400/24 p-2">
                <div className="h-7 rounded-lg bg-white/10" />
                <div className="mt-2 h-1.5 w-7 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between rounded-full border border-white/10 bg-black/35 px-3 py-1.5">
              <span className="font-manrope text-[8px] uppercase tracking-[0.14em] text-white/46">storefront</span>
              <span className="font-manrope text-[8px] uppercase tracking-[0.14em] text-fuchsia-200">live</span>
            </div>
          </div>

          <div className="mt-auto px-1 pt-2">
            <div className="grid grid-cols-4 gap-1.5 rounded-[0.85rem] border border-white/10 bg-black/40 p-1.5">
              <div className="h-3.5 rounded-md bg-white/10" />
              <div className="h-3.5 rounded-md bg-white/10" />
              <div className="h-3.5 rounded-md bg-fuchsia-400/25" />
              <div className="h-3.5 rounded-md bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#120907] p-2.5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(249,115,22,0.2),transparent_26%),radial-gradient(circle_at_72%_18%,rgba(239,68,68,0.12),transparent_28%)]" />
      <div className="relative h-full rounded-[1rem] border border-white/10 bg-black/35">
        <div className="absolute left-1/2 top-[28%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-200/15 bg-orange-300/8 shadow-[0_0_32px_rgba(251,146,60,0.12)]" />
        <div className="absolute left-1/2 top-[28%] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300/25 shadow-[0_0_18px_rgba(251,146,60,0.35)]" />

        <div className="absolute left-[18%] top-[49%] rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.14em] text-white/70">
          GPT
        </div>
        <div className="absolute right-[18%] top-[49%] rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.14em] text-white/70">
          Vision
        </div>
        <div className="absolute left-1/2 top-[58%] -translate-x-1/2 rounded-full border border-orange-300/20 bg-orange-400/16 px-2.5 py-1 font-manrope text-[8px] uppercase tracking-[0.14em] text-orange-100">
          Agent
        </div>

        <div className="absolute left-1/2 top-[34%] h-[14%] w-px -translate-x-1/2 bg-gradient-to-b from-orange-300/70 to-white/0" />
        <div className="absolute left-[28%] top-[53%] h-px w-[18%] bg-gradient-to-r from-white/0 via-white/28 to-white/0" />
        <div className="absolute right-[28%] top-[53%] h-px w-[18%] bg-gradient-to-r from-white/0 via-white/28 to-white/0" />
        <div className="absolute left-1/2 top-[57%] h-[3%] w-px -translate-x-1/2 bg-gradient-to-b from-white/18 to-orange-300/65" />

        <div className="absolute inset-x-3 bottom-3 rounded-[0.95rem] border border-white/10 bg-black/45 p-2.5 backdrop-blur-sm">
          <p className="font-manrope text-[8px] uppercase tracking-[0.16em] text-white/40">ai stack</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-1.5 w-[46%] rounded-full bg-white/10" />
            <div className="h-1.5 w-[24%] rounded-full bg-orange-400/30" />
          </div>
          <div className="mt-2.5 h-1.5 rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-orange-300 to-red-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
