'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { type Achievement, getRarityColor, getRarityLabel } from '@/lib/achievements'
import { XIcon } from '@/components/icons/Icons'

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [achievement, onDismiss])

  if (!achievement) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl shadow-2xl p-1">
            <div className="bg-gray-900 rounded-xl p-6">
              {/* Confetti Effect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-center mb-4"
              >
                <div className="text-6xl mb-2">{achievement.icon}</div>
                <div className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
                  Achievement Unlocked!
                </div>
              </motion.div>

              {/* Achievement Details */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-aged-cream mb-2">{achievement.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className={`font-semibold ${getRarityColor(achievement.rarity)}`}>
                    {getRarityLabel(achievement.rarity)}
                  </span>
                  <span className="text-aged-cream/60">•</span>
                  <span className="text-amber-400 font-semibold">+{achievement.points} pts</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onDismiss, 300)
                }}
                className="absolute top-2 right-2 text-aged-cream/60 hover:text-aged-cream transition-colors p-1 hover:bg-gray-800 rounded"
                aria-label="Dismiss"
              >
                <XIcon size={18} />
              </button>
            </div>
          </div>

          {/* Sparkle Effects */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  x: `${50 + (Math.cos((i * Math.PI * 2) / 8) * 100)}%`,
                  y: `${50 + (Math.sin((i * Math.PI * 2) / 8) * 100)}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
