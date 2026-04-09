type SectionHeaderProps = {
  className?: string
}

type ServiceTechListProps = {
  items: string[]
  compact?: boolean
}

export function SectionHeader({ className = '' }: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="font-syne text-base font-bold uppercase tracking-[0.2em] text-neutral-500 md:text-xl md:tracking-widest">
        Our Services
      </h2>
      <p className="mt-1.5 max-w-[13rem] font-manrope text-[10px] uppercase tracking-[0.12em] text-neutral-600 md:mt-2 md:max-w-sm md:text-xs md:tracking-[0.14em]">
        For businesses in Minsk and Belarus
      </p>
    </div>
  )
}

export function ServiceTechList({ items, compact = false }: ServiceTechListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'md:gap-3'}`}>
      {items.map((tech) => (
        <span
          key={tech}
          className={`rounded-full border border-white/10 bg-white/5 font-manrope uppercase text-white backdrop-blur-sm ${
            compact ? 'px-3 py-1.5 text-[10px] tracking-[0.12em]' : 'px-4 py-2 text-xs tracking-wider'
          }`}
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
