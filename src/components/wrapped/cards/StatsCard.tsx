'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { WrappedStats } from '@/lib/wrapped'

interface StatsCardProps {
  stats: WrappedStats
  onNext: () => void
}

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
}

function AnimatedCounter({ value, duration = 2000, suffix = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (value - startValue) * eased)

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsCard({ stats, onNext }: Readonly<StatsCardProps>) {
  const statItems = [
    {
      label: 'Time Travels',
      value: stats.totalSearches,
      icon: '🔍',
      delay: 0.2,
    },
    {
      label: 'Years Explored',
      value: stats.yearsExplored.length,
      icon: '📅',
      delay: 0.4,
    },
    {
      label: 'Songs Discovered',
      value: stats.discoveries.totalSongs,
      icon: '🎵',
      delay: 0.6,
    },
    {
      label: 'Movies Found',
      value: stats.discoveries.totalMovies,
      icon: '🎬',
      delay: 0.8,
    },
  ]

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
        className="font-display text-4xl md:text-5xl mb-8 text-center"
      >
        <span className="title-glow-teal">Your Numbers</span>
      </motion.h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-8">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            className="bg-crt-dark border border-crt-light/40 rounded-lg p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: stat.delay + 0.2, type: 'spring' }}
              className="text-3xl mb-2"
            >
              {stat.icon}
            </motion.div>
            <div className="text-4xl font-bold mb-1 led-text text-phosphor-teal">
              <AnimatedCounter value={stat.value} duration={2000 + index * 300} />
            </div>
            <div className="text-sm text-aged-cream/50 led-text tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue hint */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={onNext}
        className="text-phosphor-teal/60 hover:text-phosphor-teal led-text text-sm tracking-wider
                   transition-colors flex items-center gap-2"
      >
        TAP TO CONTINUE →
      </motion.button>
    </motion.div>
  )
}
