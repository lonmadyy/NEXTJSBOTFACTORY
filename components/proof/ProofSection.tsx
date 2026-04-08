'use client'

const logos = ['ALTAIR', 'NEXORA', 'SYNTHEX', 'UNITRACE', 'KATANA LABS', 'MINDPORT']

const testimonials = [
  {
    quote:
      'Bot Factory перестроил нашу digital-воронку под ключ и сократил время ответа на лиды на 63% уже в первый месяц.',
    author: 'Руководитель роста, Altair Group',
  },
  {
    quote:
      'Telegram automation and integrations were delivered faster than expected, with production-level stability.',
    author: 'COO, Nexora Commerce',
  },
  {
    quote:
      'Сильный дизайн-вкус плюс инженерная дисциплина. Итоговый продукт выглядит премиально и работает безупречно.',
    author: 'Основатель, Synthex Studio',
  },
]

export default function ProofSection() {
  return (
    <section className="relative z-10 bg-[#050505] px-4 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="font-syne text-4xl font-bold uppercase leading-none text-white md:text-6xl">
            Trusted Signals
          </h2>
          <p className="max-w-md font-manrope text-sm uppercase tracking-[0.14em] text-neutral-500">
            Partnerships, production launches, and long-term support retained
          </p>
        </div>

        <div className="relative mb-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-4 backdrop-blur-sm">
          <div className="animate-[proof-marquee_34s_linear_infinite] whitespace-nowrap motion-reduce:animate-none">
            {[...logos, ...logos].map((logo, index) => (
              <span
                key={`${logo}-${index}`}
                className="mx-3 inline-flex rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 font-syne text-[10px] uppercase tracking-[0.14em] text-white/70 md:mx-6 md:px-5 md:py-2 md:text-sm md:tracking-[0.2em]"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.author}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#4F46E5]/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <p className="relative z-10 font-manrope text-base leading-relaxed text-neutral-200">
                {item.quote}
              </p>
              <p className="relative z-10 mt-6 font-manrope text-xs uppercase tracking-[0.18em] text-neutral-500">
                {item.author}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
