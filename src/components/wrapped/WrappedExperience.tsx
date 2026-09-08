'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { WrappedStats } from '@/lib/wrapped'
import { IntroCard } from './cards/IntroCard'
import { StatsCard } from './cards/StatsCard'
import { PersonalityCard } from './cards/PersonalityCard'
import { TopItemsCard } from './cards/TopItemsCard'
import { HeatMapCard } from './cards/HeatMapCard'
import { ShareCard } from './cards/ShareCard'
import { XIcon } from '@/components/icons/Icons'

type CardState = 'intro' | 'stats' | 'personality' | 'topItems' | 'heatMap' | 'share'

const CARD_ORDER: CardState[] = ['intro', 'stats', 'personality', 'topItems', 'heatMap', 'share']

interface WrappedExperienceProps {
  stats: WrappedStats
  onClose: () => void
}

export function WrappedExperience({ stats, onClose }: Readonly<WrappedExperienceProps>) {
  const [currentCard, setCurrentCard] = useState<CardState>('intro')
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  const currentIndex = CARD_ORDER.indexOf(currentCard)

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex < CARD_ORDER.length) {
      setDirection(1)
      setCurrentCard(CARD_ORDER[nextIndex]!)
    }
  }, [currentIndex])

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setDirection(-1)
      setCurrentCard(CARD_ORDER[prevIndex]!)
    }
  }, [currentIndex])

  const goToCard = useCallback((index: number) => {
    if (index >= 0 && index < CARD_ORDER.length) {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentCard(CARD_ORDER[index]!)
    }
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrev, onClose])

  // Touch/swipe handling
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0]?.clientX ?? 0
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0]?.clientX ?? 0
      const diff = touchStartX - touchEndX

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNext() // Swipe left
        } else {
          goToPrev() // Swipe right
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [goToNext, goToPrev])

  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  const renderCard = () => {
    switch (currentCard) {
      case 'intro':
        return <IntroCard onNext={goToNext} />
      case 'stats':
        return <StatsCard stats={stats} onNext={goToNext} />
      case 'personality':
        return <PersonalityCard stats={stats} onNext={goToNext} />
      case 'topItems':
        return <TopItemsCard stats={stats} onNext={goToNext} />
      case 'heatMap':
        return <HeatMapCard stats={stats} onNext={goToNext} />
      case 'share':
        return <ShareCard stats={stats} onClose={onClose} />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-aged-cream/50 hover:text-phosphor-teal
                   bg-crt-black/50 hover:bg-crt-black rounded-full transition-colors"
        aria-label="Close"
      >
        <XIcon size={24} />
      </button>

      {/* Card container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-2xl">
          {/* VHS Border decoration */}
          <div className="absolute inset-0 bg-crt-dark border-4 border-crt-medium rounded-2xl -z-10" />

          {/* Main card area */}
          <div className="relative bg-crt-dark rounded-2xl overflow-hidden border border-crt-light/40 min-h-[600px]">
            {/* VHS Label Strip */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-crt-light/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-vhs-red animate-pulse" />
                <span className="led-text text-vhs-red text-xs tracking-widest">WRAPPED</span>
              </div>
              <span className="led-text text-aged-cream/60 text-xs">
                {currentIndex + 1} / {CARD_ORDER.length}
              </span>
            </div>

            {/* Card content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentCard}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.3 }}
                className="min-h-[500px]"
              >
                {renderCard()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {CARD_ORDER.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToCard(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === currentIndex
                      ? 'bg-phosphor-teal w-6'
                      : 'bg-crt-light/40 hover:bg-phosphor-teal/60'
                    }
                  `}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-aged-cream/40 text-xs led-text tracking-wider">
        ← → ARROWS &bull; SWIPE &bull; ESC TO CLOSE
      </div>
    </motion.div>
  )
}
