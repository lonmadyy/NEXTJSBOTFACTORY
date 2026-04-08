export default function AmbientOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(circle at center, black 22%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 22%, transparent 80%)',
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.02)_100%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_3px,rgba(255,255,255,0.01)_4px)] opacity-25" />
    </div>
  )
}
