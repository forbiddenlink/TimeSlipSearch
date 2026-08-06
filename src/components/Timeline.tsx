'use client'

import { useState, useRef } from 'react'

interface TimelineProps {
  currentYear: number
  onYearSelect: (year: number) => void
  minYear?: number
  maxYear?: number
}

export function Timeline({ 
  currentYear, 
  onYearSelect, 
  minYear = 1958, 
  maxYear = 2020 
}: TimelineProps) {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const yearRange = maxYear - minYear
  const currentPosition = ((currentYear - minYear) / yearRange) * 100

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const year = Math.round(minYear + (percentage * yearRange))
    
    if (year >= minYear && year <= maxYear) {
      onYearSelect(year)
    }
  }

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const year = Math.round(minYear + (percentage * yearRange))
    
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <span className="led-text text-phosphor-amber text-sm">{minYear}</span>
        <span className="led-text text-phosphor-teal text-xs tracking-widest">
          TIME EXPLORER
        </span>
        <span className="led-text text-phosphor-amber text-sm">{maxYear}</span>
      </div>

      <div
        ref={timelineRef}
        className="relative h-16 bg-crt-dark border-2 border-crt-light/30 rounded cursor-pointer group hover:border-phosphor-teal/50 transition-colors"
        onClick={handleTimelineClick}
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => setHoveredYear(null)}
      >
        {/* Decade markers */}
        {Array.from({ length: Math.floor(yearRange / 10) + 1 }, (_, i) => {
          const year = minYear + (i * 10)
          const position = ((year - minYear) / yearRange) * 100
          
          return (
            <div
              key={year}
              className="absolute top-0 bottom-0 border-l border-crt-light/20"
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
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap">
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
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="led-text text-phosphor-teal text-sm font-bold">
              {currentYear}
            </span>
          </div>
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
              </span>
            </div>
          </div>
        )}

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-crt-black/30 to-transparent pointer-events-none" />
      </div>

      <div className="text-center">
        <p className="text-aged-cream/50 text-xs led-text">
          CLICK ANYWHERE ON THE TIMELINE TO EXPLORE THAT YEAR
        </p>
      </div>
    </div>
  )
}
