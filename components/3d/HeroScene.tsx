'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, Sphere } from '@react-three/drei'
import { Component, ErrorInfo, ReactNode, useEffect, useRef, useState } from 'react'
import type { Mesh } from 'three'

type WebGLBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  onError?: () => void
}

type WebGLBoundaryState = {
  hasError: boolean
}

class WebGLBoundary extends Component<WebGLBoundaryProps, WebGLBoundaryState> {
  state: WebGLBoundaryState = { hasError: false }

  static getDerivedStateFromError(): WebGLBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(_error: unknown, _errorInfo: ErrorInfo) {
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function HeroSceneFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(79,70,229,0.16),rgba(5,5,5,0)_58%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(6,182,212,0.08),rgba(5,5,5,0)_62%)]" />
    </div>
  )
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')

    if (!gl) {
      return false
    }

    const loseContext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context') as {
      loseContext?: () => void
    } | null
    loseContext?.loseContext?.()

    return true
  } catch {
    return false
  }
}

function AnimatedSphere({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<Mesh>(null)
  const segments = isMobile ? 36 : 64

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.16
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.24
    }
  })

  return (
    <Float
      speed={isMobile ? 1.55 : 1.75}
      rotationIntensity={isMobile ? 0.9 : 1.2}
      floatIntensity={isMobile ? 1.1 : 1.6}
    >
      <Sphere
        args={[1.5, segments, segments]}
        ref={meshRef}
      >
          <MeshDistortMaterial
          color="#1A1A1A"
          attach="material"
          distort={isMobile ? 0.34 : 0.45}
          speed={isMobile ? 1.35 : 1.85}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  )
}

export default function HeroScene() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  const [isReady, setIsReady] = useState(false)
  const [isWebGLAvailable] = useState(() => {
    if (typeof window === 'undefined') return true
    return canUseWebGL()
  })
  const [hasWebGLFailure, setHasWebGLFailure] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const updateMedia = () => setIsMobile(media.matches)

    const timeoutId = window.setTimeout(() => setIsReady(true), 90)
    media.addEventListener('change', updateMedia)

    return () => {
      media.removeEventListener('change', updateMedia)
      window.clearTimeout(timeoutId)
    }
  }, [])

  const dpr: [number, number] = isMobile ? [1, 1.35] : [1, 2]

  return (
    <div className="absolute inset-0 z-0 h-full w-full" aria-hidden="true">
      {(!isReady || !isWebGLAvailable || hasWebGLFailure) && <HeroSceneFallback />}

      {isWebGLAvailable && !hasWebGLFailure && (
        <WebGLBoundary
          fallback={<HeroSceneFallback />}
          onError={() => {
            setHasWebGLFailure(true)
            setIsReady(true)
          }}
        >
          <Canvas
            dpr={dpr}
            fallback={<HeroSceneFallback />}
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{
              antialias: !isMobile,
              powerPreference: isMobile ? 'low-power' : 'high-performance',
            }}
            onCreated={() => setIsReady(true)}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" resolution={isMobile ? 64 : 256} />
            <AnimatedSphere isMobile={isMobile} />
          </Canvas>
        </WebGLBoundary>
      )}
    </div>
  )
}
