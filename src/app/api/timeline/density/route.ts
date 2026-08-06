import { NextResponse } from 'next/server'
import { getYearDensity } from '@/lib/algolia'

// Read-only aggregate; safe to cache aggressively. Facet counts change only on re-ingest.
export const revalidate = 3600 // 1 hour

export interface TimelineDensityResponse {
  density: Record<number, number>
  min: number
  max: number
}

export async function GET() {
  const density = await getYearDensity()
  const counts = Object.values(density)

  const body: TimelineDensityResponse = {
    density,
    min: counts.length > 0 ? Math.min(...counts) : 0,
    max: counts.length > 0 ? Math.max(...counts) : 0,
  }

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
