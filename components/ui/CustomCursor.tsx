'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const hoveredRef = useRef(false)

  useEffect(() => {
    const interactiveSelector = 'a, button, [role="button"], [data-cursor="interactive"]'
    const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopMedia = window.matchMedia('(min-width: 768px)')
    const canUseCursor =
      hoverMedia.matches && !reduceMotionMedia.matches && desktopMedia.matches

    setEnabled(canUseCursor)
    if (!canUseCursor) return

    document.body.style.cursor = 'none'
    positionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const applyVisualState = () => {
      const outer = outerRef.current
      if (!outer) return

      const hovered = hoveredRef.current
      outer.style.backgroundColor = hovered
        ? 'rgba(79, 70, 229, 0.20)'
        : 'rgba(255,255,255,0.05)'
      outer.style.boxShadow = hovered
        ? '0 0 24px rgba(79,70,229,0.45), inset 0 0 16px rgba(6,182,212,0.25)'
        : '0 0 10px rgba(255,255,255,0.12)'
    }

    const applyPosition = (x: number, y: number) => {
      positionRef.current = { x, y }
      const scale = hoveredRef.current ? 2 : 1

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${x - 11}px, ${y - 11}px, 0) scale(${scale})`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${x - 2}px, ${y - 2}px, 0)`
      }
    }

    const handleMove = (event: PointerEvent | MouseEvent) => {
      applyPosition(event.clientX, event.clientY)
    }

    const handleOver = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target || !target.closest(interactiveSelector)) return
      if (hoveredRef.current) return
      hoveredRef.current = true
      applyVisualState()
      applyPosition(positionRef.current.x, positionRef.current.y)
    }

    const handleOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target || !target.closest(interactiveSelector)) return
      const related = event.relatedTarget as HTMLElement | null
      if (related?.closest(interactiveSelector)) return
      if (!hoveredRef.current) return
      hoveredRef.current = false
      applyVisualState()
      applyPosition(positionRef.current.x, positionRef.current.y)
    }

    applyVisualState()
    applyPosition(positionRef.current.x, positionRef.current.y)
    const useRawPointer = 'onpointerrawupdate' in window
    const moveEvent = useRawPointer ? 'pointerrawupdate' : 'pointermove'
    window.addEventListener(moveEvent, handleMove as EventListener, { passive: true })
    if (useRawPointer) {
      window.addEventListener('pointermove', handleMove as EventListener, { passive: true })
    }
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener(moveEvent, handleMove as EventListener)
      if (useRawPointer) {
        window.removeEventListener('pointermove', handleMove as EventListener)
      }
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] hidden md:block">
      <div
        ref={outerRef}
        className="absolute rounded-full border border-white/40 transition-[background-color,box-shadow] duration-150"
        style={{
          left: 0,
          top: 0,
          width: 22,
          height: 22,
          willChange: 'transform',
          contain: 'layout paint',
          transform: 'translate3d(-100px, -100px, 0)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          boxShadow: '0 0 10px rgba(255,255,255,0.12)',
        }}
      />
      <div
        ref={innerRef}
        className="absolute rounded-full bg-white/90"
        style={{
          left: 0,
          top: 0,
          width: 4,
          height: 4,
          willChange: 'transform',
          contain: 'layout paint',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
    </div>
  )
}
