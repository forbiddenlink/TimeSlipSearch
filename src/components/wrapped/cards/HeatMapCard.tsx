'use client'

import { motion } from 'motion/react'
import type { WrappedStats } from '@/lib/wrapped'

interface HeatMapCardProps {
  stats: WrappedStats
  onNext: () => void
}

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']

export function HeatMapCard({ stats, onNext }: Readonly<HeatMapCardProps>) {
  const { decadeHeatMap } = stats

  // Calculate max for color intensity
  const values = Object.values(decadeHeatMap)
  const maxCount = Math.max(...values, 1)

  // Get intensity level (0-4) for color
  const getIntensity = (count: number): number => {
    if (count === 0) return 0
    const ratio = count / maxCount
    if (ratio > 0.75) return 4
    if (ratio > 0.5) return 3
    if (ratio > 0.25) return 2
    return 1
  }

  // Color classes based on intensity
  const getColorClass = (intensity: number): string => {
    switch (intensity) {
      case 0:
        return 'bg-crt-dark border-crt-light/20'
      case 1:
        return 'bg-phosphor-teal/20 border-phosphor-teal/30'
      case 2:
        return 'bg-phosphor-teal/40 border-phosphor-teal/50'
      case 3:
        return 'bg-phosphor-teal/60 border-phosphor-teal/70'
      case 4:
        return 'bg-phosphor-teal/80 border-phosphor-teal shadow-glow-teal'
      default:
        return 'bg-crt-dark border-crt-light/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8"
    >
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl md:text-5xl mb-4 text-center"
      >
        <span className="title-glow-teal">Your Time Map</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-aged-cream/60 text-sm led-text tracking-wider mb-8"
      >
        WHERE YOU&apos;VE TRAVELED THROUGH TIME
      </motion.p>

      {/* Heat Map Grid */}
      <div className="grid grid-cols-4 gap-3 mb-8 w-full max-w-md">
        {DECADES.map((decade, index) => {
          const count = decadeHeatMap[decade] || 0
          const intensity = getIntensity(count)

          return (
            <motion.div
              key={decade}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`
                relative p-4 rounded-lg border transition-all
                ${getColorClass(intensity)}
              `}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-aged-cream led-text">
                  {decade.replace('s', "'s")}
                </div>
                <div className={`text-2xl font-bold mt-1 ${count > 0 ? 'text-phosphor-teal' : 'text-aged-cream/30'}`}>
                  {count}
                </div>
                <div className="text-xs text-aged-cream/50 mt-1">
                  {count === 1 ? 'visit' : 'visits'}
                </div>
              </div>

              {/* Top decade indicator */}
              {stats.topDecade === decade && count > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-phosphor-amber rounded-full flex items-center justify-center"
                >
                  <span className="text-xs">⭐</span>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-2 mb-8"
      >
        <span className="text-xs text-aged-cream/50 led-text">LESS</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`w-4 h-4 rounded ${getColorClass(level)} border`}
          />
        ))}
        <span className="text-xs text-aged-cream/50 led-text">MORE</span>
      </motion.div>

      {/* Session stats if available */}
      {stats.longestSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="bg-crt-dark border border-crt-light/30 rounded-lg p-4 text-center mb-6"
        >
          <div className="text-phosphor-amber/60 text-xs led-text tracking-widest mb-1">
            LONGEST SESSION
          </div>
          <div className="text-2xl font-bold text-phosphor-amber">
            {stats.longestSession.searches} searches
          </div>
          <div className="text-xs text-aged-cream/50 mt-1">
            {stats.longestSession.date}
          </div>
        </motion.div>
      )}

      {/* Continue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        onClick={onNext}
        className="text-phosphor-teal/60 hover:text-phosphor-teal led-text text-sm tracking-wider
                   transition-colors flex items-center gap-2"
      >
        TAP TO CONTINUE →
      </motion.button>
    </motion.div>
  )
}
