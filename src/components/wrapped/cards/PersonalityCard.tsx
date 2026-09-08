'use client'

import { motion } from 'motion/react'
import { getPersonalityDescription, determineEraAffinity, type WrappedStats } from '@/lib/wrapped'

interface PersonalityCardProps {
  stats: WrappedStats
  onNext: () => void
}

export function PersonalityCard({ stats, onNext }: Readonly<PersonalityCardProps>) {
  const personality = getPersonalityDescription(stats.personality)
  const eraAffinityData = determineEraAffinity(stats)

  // Determine era affinity based on analysis
  const eraAffinity = eraAffinityData.decade

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center"
    >
      {/* Emoji reveal with dramatic animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="relative mb-6"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 text-9xl blur-2xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {personality.emoji}
        </motion.div>
        <span className="text-9xl relative z-10">{personality.emoji}</span>
      </motion.div>

      {/* Personality type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-4"
      >
        <span className="text-phosphor-amber/60 text-sm led-text tracking-widest">
          YOU ARE A
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="font-display text-4xl md:text-5xl mb-4 text-phosphor-teal"
      >
        {personality.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-aged-cream/70 text-lg font-body italic max-w-md mb-8"
      >
        {personality.description}
      </motion.p>

      {/* Era Affinity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-crt-dark border border-phosphor-amber/30 rounded-lg p-6 mb-8"
      >
        <div className="text-phosphor-amber/60 text-sm led-text tracking-widest mb-2">
          YOUR ERA
        </div>
        <div className="font-display text-5xl text-phosphor-amber">
          {eraAffinity}
        </div>
        <div className="text-aged-cream/60 text-sm mt-2 font-body italic max-w-xs mx-auto">
          {eraAffinityData.reason}
        </div>
      </motion.div>

      {/* Continue */}
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
