'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
}: MagneticButtonProps) {
  const magneticRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = magneticRef.current
    if (!element) return

    const xTo = gsap.quickTo(element, 'x', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    })
    const yTo = gsap.quickTo(element, 'y', {
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    })

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = element.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)

      xTo(x * 0.35)
      yTo(y * 0.35)
    }

    const handleMouseLeave = () => {
      xTo(0)
      yTo(0)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const baseClassName = `relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full transition-colors duration-300 ${className}`

  if (href) {
    return (
      <Link
        href={href}
        ref={magneticRef as React.Ref<HTMLAnchorElement>}
        onClick={onClick}
        data-cursor="interactive"
        className={baseClassName}
      >
        {children}
      </Link>
    )
  }

  return (
    <div
      ref={magneticRef as React.Ref<HTMLDivElement>}
      onClick={onClick}
      role="button"
      tabIndex={0}
      data-cursor="interactive"
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      className={baseClassName}
    >
      {children}
    </div>
  )
}
