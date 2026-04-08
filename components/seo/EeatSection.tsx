import { siteConfig } from '@/lib/site'

const points = [
  {
    title: 'Сроки под контроль',
    description:
      'Простые проекты реализуем до 1 недели. Сложные решения с интеграциями и расширенной логикой — до 3 недель.',
  },
  {
    title: 'Гарантия 2 месяца',
    description:
      'Поддерживаем качество после запуска: исправляем дефекты, связанные с нашей реализацией, в гарантийный период.',
  },
  {
    title: 'Прозрачный договор',
    description:
      'Перед стартом фиксируем в договоре этапы, сроки, стоимость и гарантийные обязательства без скрытых условий.',
  },
]

export default function EeatSection() {
  return (
    <section className="relative z-10 bg-[#050505] px-4 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-syne text-4xl font-bold uppercase leading-none text-white md:text-6xl">
              Экспертиза <br />
              <span className="text-neutral-500">и прозрачность</span>
            </h2>
            <p className="mt-6 max-w-xl font-manrope text-lg text-neutral-400">
              Работаем с бизнесом в Минске и по Беларуси: проектируем цифровые продукты, фиксируем
              ответственность в договоре и обеспечиваем предсказуемый результат.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <p className="font-manrope text-sm text-neutral-300">
                <span className="text-white">Experience:</span> более 100 реализованных проектов.
              </p>
              <p className="font-manrope text-sm text-neutral-300">
                <span className="text-white">Expertise:</span> web-разработка, Telegram-боты,
                AI-интеграции и CRM/API связки.
              </p>
              <p className="font-manrope text-sm text-neutral-300">
                <span className="text-white">Authoritativeness:</span> работаем официально,
                зарегистрированы в Республике Беларусь.
              </p>
              <p className="font-manrope text-sm text-neutral-300">
                <span className="text-white">Trust:</span> договор, гарантия, и понятные этапы
                проекта.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {points.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md"
              >
                <h3 className="font-syne text-2xl font-bold uppercase text-white">{point.title}</h3>
                <p className="mt-3 font-manrope text-neutral-400">{point.description}</p>
              </article>
            ))}

            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <h3 className="font-syne text-2xl font-bold uppercase text-white">Реквизиты</h3>
              <div className="mt-4 space-y-2 font-manrope text-sm text-neutral-300">
                <p>
                  <span className="text-white">ФИО:</span> {siteConfig.founder}
                </p>
                <p>
                  <span className="text-white">Телефон:</span> {siteConfig.phoneDisplay}
                </p>
                <p>
                  <span className="text-white">Email:</span> {siteConfig.email}
                </p>
                <p>
                  <span className="text-white">УНП:</span> {siteConfig.unp}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
