'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getEra, DECADE_CHAPTERS } from '@/lib/archive'
import type { TimelineDensityResponse } from '@/app/api/timeline/density/route'

interface TimelineProps {
  currentYear: number
  onYearSelect: (year: number) => void
  minYear?: number
  maxYear?: number
}

/** Synthetic archive-growth curve used until (or if) live facet counts load. */
function syntheticDensity(year: number, minYear: number, maxYear: number): number {
  const t = (year - minYear) / (maxYear - minYear)
  // Gentle hump: catalog fills out through the 70s-2000s.
  return 0.3 + 0.7 * Math.sin(Math.max(0, Math.min(1, t)) * Math.PI)
}

export function Timeline({
  currentYear,
  onYearSelect,
  minYear = 1958,
  maxYear = 2020,
}: TimelineProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [density, setDensity] = useState<Record<number, number> | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const yearRange = maxYear - minYear
  const currentPosition = ((currentYear - minYear) / yearRange) * 100

  // Era follows the cursor while scrubbing, otherwise the selected year.
  const activeYear = hoveredYear ?? currentYear
  const era = getEra(activeYear)
  const crossfade = prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeInOut' as const }

  // Fetch real records-per-year density from Algolia facets (read-only, cached).
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/timeline/density', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: TimelineDensityResponse | null) => {
        if (data && Object.keys(data.density ?? {}).length > 0) {
          setDensity(data.density)
        }
      })
      .catch(() => {
        /* fall back to the synthetic curve */
      })
    return () => controller.abort()
  }, [])

  // Normalized bar heights (12%..100%) per year, from live data or the fallback curve.
  const bars = useMemo(() => {
    const years = Array.from({ length: yearRange + 1 }, (_, i) => minYear + i)
    const raw = years.map((y) =>
      density ? density[y] ?? 0 : syntheticDensity(y, minYear, maxYear)
    )
    const max = Math.max(...raw, 1)
    return years.map((year, i) => ({
      year,
      height: 12 + 88 * (raw[i]! / max),
      count: density ? density[year] ?? 0 : null,
    }))
  }, [density, minYear, maxYear, yearRange])

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const year = Math.round(minYear + percentage * yearRange)

    if (year >= minYear && year <= maxYear) {
      onYearSelect(year)
    }
  }

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const year = Math.round(minYear + percentage * yearRange)

    if (year >= minYear && year <= maxYear) {
      setHoveredYear(year)
    }
  }

  // Notable events markers
  const notableYears = [
    { year: 1969, label: '🌙 Moon Landing', color: 'phosphor-amber' },
    { year: 1989, label: '🧱 Berlin Wall', color: 'phosphor-teal' },
    { year: 1984, label: '🎮 Gaming Era', color: 'phosphor-green' },
    { year: 2000, label: '💻 Y2K', color: 'vinyl-label' },
  ]

  const activeDecade = Math.floor(currentYear / 10) * 10

  return (
    <div className="space-y-4">
      {/* === DECADE SPINE: chaptered quick-nav (book-spine tabs) === */}
      <div className="reading-room-spine flex items-stretch gap-px rounded overflow-hidden border border-crt-light/30">
        {DECADE_CHAPTERS.map((chapter) => {
          const isActive = Math.floor(chapter.start / 10) * 10 === activeDecade
          return (
            <button
              key={chapter.start}
              type="button"
              onClick={() => onYearSelect(chapter.start)}
              aria-pressed={isActive}
              aria-label={`Jump to the ${chapter.label} — ${chapter.medium} era`}
              title={`${chapter.label} · ${chapter.medium}`}
              className={`spine-tab flex-1 min-w-0 px-1 py-2 text-center transition-colors ${
                isActive
                  ? 'bg-crt-medium text-phosphor-teal shadow-glow-teal'
                  : 'bg-crt-dark text-aged-cream/60 hover:text-phosphor-teal hover:bg-crt-medium/60'
              }`}
            >
              <span className="led-text text-sm tracking-widest block">{chapter.label}</span>
              <span className="text-[9px] uppercase tracking-wider text-aged-cream/40 hidden sm:block truncate">
                {chapter.medium}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between px-2">
        <span className="led-text text-phosphor-amber text-sm">{minYear}</span>
        <motion.span
          className="led-text text-xs tracking-widest"
          animate={{ color: era.ink }}
          transition={crossfade}
          style={{ fontFamily: era.font }}
        >
          READING ROOM · {era.medium.toUpperCase()}
        </motion.span>
        <span className="led-text text-phosphor-amber text-sm">{maxYear}</span>
      </div>

      <div
        ref={timelineRef}
        className="relative h-16 bg-crt-dark border-2 border-crt-light/30 rounded cursor-pointer group hover:border-phosphor-teal/50 transition-colors overflow-hidden"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => setHoveredYear(null)}
      >
        {/* Density-weighted bars (records-per-year) */}
        <div className="absolute inset-0 flex items-end pointer-events-none" aria-hidden="true">
          {bars.map((bar) => (
            <div
              key={bar.year}
              className="flex-1 bg-gradient-to-t from-phosphor-teal/40 to-phosphor-teal/5"
              style={{ height: `${bar.height}%` }}
            />
          ))}
        </div>

        {/* Era color-temperature wash (crossfades on scrub) */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          animate={{ backgroundColor: era.tint }}
          transition={crossfade}
          aria-hidden="true"
        />

        {/* Decade markers */}
        {Array.from({ length: Math.floor(yearRange / 10) + 1 }, (_, i) => {
          const year = minYear + i * 10
          const position = ((year - minYear) / yearRange) * 100

          return (
            <div
              key={year}
              className="absolute top-0 bottom-0 border-l border-crt-light/20 pointer-events-none"
              style={{ left: `${position}%` }}
            >
              <span className="absolute -bottom-5 -left-4 text-aged-cream/60 text-xs led-text">
                {year}
              </span>
            </div>
          )
        })}

        {/* Notable events */}
        {notableYears.map(({ year, label, color }) => {
          const position = ((year - minYear) / yearRange) * 100
          return (
            <div
              key={year}
              className="absolute top-1/2 -translate-y-1/2 group/marker"
              style={{ left: `${position}%` }}
            >
              <div className={`w-3 h-3 rounded-full bg-${color} border-2 border-crt-dark animate-pulse`} />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-30">
                <div className="bg-crt-dark border border-crt-light/50 rounded px-2 py-1">
                  <span className="text-aged-cream text-xs">{label}</span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Current year indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-phosphor-teal shadow-glow-teal transition-all duration-300"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 rotate-45 bg-phosphor-teal border-2 border-crt-dark" />
          </div>
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            animate={{ color: era.ink }}
            transition={crossfade}
          >
            <span className="led-text text-sm font-bold" style={{ fontFamily: era.font }}>
              {currentYear}
            </span>
          </motion.div>
        </div>

        {/* Hover indicator */}
        {hoveredYear && hoveredYear !== currentYear && (
          <div
            className="absolute top-0 bottom-0 w-px bg-aged-cream/50"
            style={{ left: `${((hoveredYear - minYear) / yearRange) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-aged-cream/70 text-xs led-text">
                {hoveredYear}
                {(() => {
                  const c = density?.[hoveredYear]
                  return c ? ` · ${c.toLocaleString()} recs` : ''
                })()}
              </span>
            </div>
          </div>
        )}

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-crt-black/30 to-transparent pointer-events-none" />
      </div>

      <div className="text-center">
        <p className="text-aged-cream/50 text-xs led-text">
          {density
            ? 'BAR HEIGHT = RECORDS ON FILE PER YEAR · CLICK TO OPEN THAT YEAR'
            : 'CLICK ANYWHERE ON THE TIMELINE TO EXPLORE THAT YEAR'}
        </p>
      </div>
    </div>
  )
}
