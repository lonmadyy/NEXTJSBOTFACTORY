'use client'

import type { ReactNode } from 'react'
import FloatingBotCta from '@/components/layout/FloatingBotCta'
import ScrollStoryline from '@/components/layout/ScrollStoryline'
import { ScrollUiStateProvider } from '@/components/layout/ScrollUiStateProvider'
import StickyTopNav from '@/components/layout/StickyTopNav'
import SmoothScroll from '@/components/providers/SmoothScroll'
import CustomCursor from '@/components/ui/CustomCursor'

export default function HomeRuntimeShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <ScrollUiStateProvider>
        <div className="flex min-h-screen flex-col bg-[#050505] text-white selection:bg-[#4F46E5] selection:text-white">
          <StickyTopNav />
          <ScrollStoryline />
          <FloatingBotCta />
          <CustomCursor />
          {children}
        </div>
      </ScrollUiStateProvider>
    </SmoothScroll>
  )
}
