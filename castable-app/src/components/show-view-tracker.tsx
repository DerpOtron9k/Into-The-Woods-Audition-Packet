'use client'

import { useEffect } from 'react'
import { trackShowViewed } from '@/lib/analytics'

interface ShowViewTrackerProps {
  showId: string
  showTitle: string
}

export function ShowViewTracker({ showId, showTitle }: ShowViewTrackerProps) {
  useEffect(() => {
    // Track show view
    trackShowViewed(showId, showTitle)
  }, [showId, showTitle])

  return null
}

