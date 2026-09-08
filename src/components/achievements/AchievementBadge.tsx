'use client'

import { motion } from 'motion/react'
import { type Achievement, getRarityColor } from '@/lib/achievements'
import { CheckCircleIcon, LockIcon } from '@/components/icons/Icons'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'small' | 'medium' | 'large'
}

export function AchievementBadge({ achievement, size = 'medium' }: AchievementBadgeProps) {
  const sizes = {
    small: {
      container: 'w-16 h-20',
      icon: 'text-2xl',
      title: 'text-xs',
      progress: 'h-1',
    },
    medium: {
      container: 'w-24 h-28',
      icon: 'text-4xl',
      title: 'text-sm',
      progress: 'h-1.5',
    },
    large: {
      container: 'w-32 h-36',
      icon: 'text-5xl',
      title: 'text-base',
      progress: 'h-2',
    },
  }

  const sizeClasses = sizes[size]
  const progressPercent = (achievement.progress / achievement.requirement) * 100

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizeClasses.container} relative group cursor-pointer`}
    >
      {/* Badge Container */}
      <div
        className={`
          relative h-full rounded-lg p-3 flex flex-col items-center justify-between
          ${
            achievement.unlocked
              ? 'bg-crt-dark border border-phosphor-teal/40 shadow-glow-teal'
              : 'bg-crt-dark/50 border border-crt-light/20'
          }
          transition-all duration-300
        `}
      >
        {/* Icon */}
        <div
          className={`
            ${sizeClasses.icon}
            ${achievement.unlocked ? 'opacity-100' : 'opacity-30 grayscale'}
            transition-all duration-300
          `}
        >
          {achievement.icon}
        </div>

        {/* Title */}
        <div className="text-center">
          <div
            className={`
              ${sizeClasses.title} font-semibold line-clamp-2 led-text
              ${achievement.unlocked ? 'text-aged-cream' : 'text-aged-cream/30'}
            `}
          >
            {achievement.title}
          </div>
        </div>

        {/* Progress Bar (for locked achievements) */}
        {!achievement.unlocked && (
          <div className={`w-full bg-crt-medium rounded-full ${sizeClasses.progress} mt-2`}>
            <motion.div
              className="bg-phosphor-teal h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressPercent, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Locked/Unlocked Indicator */}
        {achievement.unlocked ? (
          <div className="absolute -top-2 -right-2 bg-phosphor-amber rounded-full p-1 shadow-glow-amber">
            <CheckCircleIcon size={16} className="text-crt-black" />
          </div>
        ) : (
          <div className="absolute -top-2 -right-2 bg-crt-medium rounded-full p-1 border border-crt-light/30">
            <LockIcon size={16} className="text-aged-cream/60" />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="bg-crt-black border border-crt-light/40 rounded-lg p-3 shadow-crt max-w-xs whitespace-normal">
          <div className="text-sm font-semibold text-aged-cream mb-1">{achievement.title}</div>
          <div className="text-xs text-aged-cream/60 mb-2">{achievement.description}</div>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-semibold led-text ${getRarityColor(achievement.rarity)}`}>
              {achievement.rarity.toUpperCase()}
            </span>
            <span className="text-phosphor-amber led-text">{achievement.points} pts</span>
          </div>
          {!achievement.unlocked && (
            <div className="mt-2 text-xs text-aged-cream/60 led-text">
              Progress: {achievement.progress}/{achievement.requirement}
            </div>
          )}
          {achievement.unlockedAt && (
            <div className="mt-2 text-xs text-aged-cream/30 led-text">
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
