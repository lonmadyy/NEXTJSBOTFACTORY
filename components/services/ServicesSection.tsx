'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'

const ServicesSectionDesktop = dynamic(() => import('@/components/services/ServicesSectionDesktop'))
const ServicesSectionMobile = dynamic(() => import('@/components/services/ServicesSectionMobile'))

function subscribeToViewport(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const query = window.matchMedia('(min-width: 768px)')

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onStoreChange)
    return () => query.removeEventListener('change', onStoreChange)
  }

  query.addListener(onStoreChange)
  return () => query.removeListener(onStoreChange)
}

function getViewportSnapshot() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia('(min-width: 768px)').matches
}

export default function ServicesSection() {
  const isDesktop = useSyncExternalStore(
    subscribeToViewport,
    getViewportSnapshot,
    () => false
  )

  return isDesktop ? <ServicesSectionDesktop /> : <ServicesSectionMobile />
}
