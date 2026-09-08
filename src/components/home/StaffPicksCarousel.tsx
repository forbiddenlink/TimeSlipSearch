'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getSeasonalPicks, getCategoryIcon, type FamousDate } from '@/lib/famous-dates'

interface StaffPicksCarouselProps {
  onSelect: (query: string) => void
}

export function StaffPicksCarousel({ onSelect }: Readonly<StaffPicksCarouselProps>) {
  const [picks, setPicks] = useState<FamousDate[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load seasonal picks on mount
  useEffect(() => {
    setPicks(getSeasonalPicks())
  }, [])

  // Auto-rotate every 8 seconds (pause on hover)
  useEffect(() => {
    if (isPaused || picks.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % picks.length)
    }, 8000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, picks.length])

  const handleClick = useCallback((pick: FamousDate) => {
    // Format as "Month Day, Year"
    const [month, day] = pick.date.split('-')
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const monthName = monthNames[parseInt(month ?? '1', 10) - 1]
    const query = `${monthName} ${parseInt(day ?? '1', 10)}, ${pick.year}`
    onSelect(query)
  }, [onSelect])

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  if (picks.length === 0) return null

  // Constants for layout
  const CARD_WIDTH = 280 // w-70 equivalent (approx) or slightly larger than w-64
  const GAP = 16 // gap-4

  return (
    <div
      className="mb-12 animate-fade-in relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Section header with VHS tape label aesthetic */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent via-phosphor-amber/40 to-phosphor-amber/60" />
        <span className="led-text text-phosphor-amber text-sm tracking-widest uppercase glow-text-subtle">
          Staff Picks
        </span>
        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent via-phosphor-amber/40 to-phosphor-amber/60" />
      </div>

      {/* Carousel container with mask for fade-out edges */}
      <div
        className="relative overflow-hidden h-[180px] mask-gradient-x"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="absolute left-1/2 top-0 h-full w-full">
          <motion.div
            className="flex gap-4 absolute top-0"
            initial={false}
            animate={{
              x: `calc(-50% - ${currentIndex * (CARD_WIDTH + GAP)}px + ${CARD_WIDTH / 2}px)`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AnimatePresence mode="popLayout">
              {picks.map((pick, index) => (
                <motion.button
                  key={`${pick.date}-${pick.year}`}
                  onClick={() => handleClick(pick)}
                  className={`
                    flex-shrink-0 relative overflow-hidden rounded-lg
                    transition-all duration-300
                    text-left border backdrop-blur-sm
                    ${index === currentIndex
                      ? 'border-phosphor-amber shadow-glow-amber z-10 bg-crt-medium'
                      : 'border-crt-light/30 opacity-60 hover:opacity-100 hover:border-phosphor-teal/50 hover:scale-[1.02] bg-crt-dark'
                    }
                  `}
                  style={{
                    width: CARD_WIDTH,
                    height: '160px', // Fixed height
                  }}
                  animate={{
                    scale: index === currentIndex ? 1.05 : 1,
                    opacity: index === currentIndex ? 1 : 0.6,
                    filter: index === currentIndex ? 'grayscale(0%)' : 'grayscale(30%)',
                  }}
                  whileHover={{
                    scale: index === currentIndex ? 1.05 : 1.02,
                    filter: 'grayscale(0%)'
                  }}
                >
                  {/* VHS tape label decoration */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-lg ${index === currentIndex
                    ? 'bg-gradient-to-r from-phosphor-amber/60 via-vhs-red/60 to-phosphor-amber/60'
                    : 'bg-crt-light'
                    }`} />

                  <div className="p-4 pt-5 h-full flex flex-col">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0 filter drop-shadow-md">
                        {getCategoryIcon(pick.category)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm leading-tight truncate ${index === currentIndex ? 'text-aged-cream glow-text-subtle' : 'text-aged-cream/80'
                          }`}>
                          {pick.title}
                        </h3>
                        <p className="text-phosphor-teal text-sm led-text mt-1 tracking-wider">
                          {pick.year}
                        </p>
                      </div>
                    </div>

                    <p className="text-aged-cream/70 text-sm mt-3 line-clamp-3 leading-relaxed">
                      {pick.description}
                    </p>

                    {/* Play indicator */}
                    <div className={`absolute bottom-3 right-3 text-xs led-text transition-all duration-300 ${index === currentIndex ? 'text-phosphor-teal opacity-100' : 'text-phosphor-teal/40 opacity-0 group-hover:opacity-100'
                      }`}>
                      ▶ PLAY
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Manual Navigation Controls - Enhanced */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={() => goTo((currentIndex - 1 + picks.length) % picks.length)}
          className="text-phosphor-teal/50 hover:text-phosphor-teal hover:scale-110 transition-all"
          aria-label="Previous pick"
        >
          ←
        </button>

        <div className="flex gap-1.5">
          {picks.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${index === currentIndex
                  ? 'bg-phosphor-amber w-6 shadow-[0_0_8px_rgba(255,191,0,0.6)]'
                  : 'bg-crt-light/40 w-1.5 hover:bg-phosphor-teal/60'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => goTo((currentIndex + 1) % picks.length)}
          className="text-phosphor-teal/50 hover:text-phosphor-teal hover:scale-110 transition-all"
          aria-label="Next pick"
        >
          →
        </button>
      </div>
    </div>
  )
}

