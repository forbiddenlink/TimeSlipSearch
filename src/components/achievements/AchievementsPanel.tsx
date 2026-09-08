'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { getUserAchievements, type UserAchievements } from '@/lib/achievements'
import { AchievementBadge } from './AchievementBadge'
import { XIcon } from '@/components/icons/Icons'

interface AchievementsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AchievementsPanel({ isOpen, onClose }: AchievementsPanelProps) {
  const [achievements, setAchievements] = useState<UserAchievements | null>(null)
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  useEffect(() => {
    if (isOpen) {
      setAchievements(getUserAchievements())
    }
  }, [isOpen])

  if (!achievements) return null

  const filteredAchievements = achievements.achievements.filter((achievement) => {
    if (filter === 'unlocked') return achievement.unlocked
    if (filter === 'locked') return !achievement.unlocked
    return true
  })

  const categories = Array.from(
    new Set(achievements.achievements.map((a) => a.category))
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden bg-crt-black rounded-2xl shadow-crt border border-crt-light/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-crt-dark border-b border-crt-light/20 p-6">
              {/* VHS Label Strip */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-crt-light/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vhs-red animate-pulse" />
                  <span className="led-text text-vhs-red text-xs tracking-widest">REC ACHIEVEMENTS</span>
                </div>
                <span className="led-text text-aged-cream/60 text-xs">TIMESLIP v1.0</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-aged-cream/50 hover:text-phosphor-teal transition-colors p-2 bg-crt-black/50 hover:bg-crt-black rounded-full"
                aria-label="Close"
              >
                <XIcon size={20} />
              </button>

              <h2 className="font-display text-3xl mb-4 cascade-in">
                <span className="title-glow-teal">Achieve</span>
                <span className="title-glow-amber">ments</span>
              </h2>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 cascade-in stagger-2">
                <div className="bg-crt-dark border border-crt-light/40 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold led-text text-phosphor-teal">
                    {achievements.unlockedCount}/{achievements.achievements.length}
                  </div>
                  <div className="text-sm text-aged-cream/50 led-text tracking-wider">Unlocked</div>
                </div>
                <div className="bg-crt-dark border border-crt-light/40 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold led-text text-phosphor-amber">
                    {achievements.totalPoints}
                  </div>
                  <div className="text-sm text-aged-cream/50 led-text tracking-wider">Total Points</div>
                </div>
                <div className="bg-crt-dark border border-crt-light/40 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold led-text text-vhs-red">
                    {achievements.streak.current}
                  </div>
                  <div className="text-sm text-aged-cream/50 led-text tracking-wider">Day Streak</div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mt-4 cascade-in stagger-3">
                {(['all', 'unlocked', 'locked'] as const).map((filterOption) => (
                  <button
                    type="button"
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all led-text tracking-wider
                      ${filter === filterOption
                        ? 'bg-phosphor-teal text-crt-black shadow-glow-teal'
                        : 'bg-crt-dark border border-crt-light/30 text-aged-cream/60 hover:border-phosphor-teal/40 hover:text-phosphor-teal'
                      }
                    `}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)] retro-scroll">
              {categories.map((category, categoryIndex) => {
                const categoryAchievements = filteredAchievements.filter(
                  (a) => a.category === category
                )

                if (categoryAchievements.length === 0) return null

                return (
                  <div key={category} className={`mb-8 cascade-in stagger-${Math.min(categoryIndex + 4, 8)}`}>
                    <h3 className="text-xl font-display text-aged-cream mb-4 capitalize flex items-center gap-2">
                      <span className="w-1 h-6 rounded-full bg-phosphor-teal shadow-glow-teal" />
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {categoryAchievements.map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          size="medium"
                        />
                      ))}
                    </div>
                  </div>
                )
              })}

              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">&#x1F512;</div>
                  <p className="text-aged-cream/60 led-text tracking-wider">
                    No {filter === 'all' ? '' : filter} achievements yet
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
