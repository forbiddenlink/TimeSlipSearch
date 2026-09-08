'use client'

import { motion } from 'motion/react'

interface IntroCardProps {
  onNext: () => void
}

export function IntroCard({ onNext }: Readonly<IntroCardProps>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
    >
      {/* VHS Boot Animation */}
      <motion.div
        initial={{ scaleY: 0.01, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <motion.div
          className="absolute inset-0 bg-phosphor-teal/20 blur-3xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h1 className="font-display text-6xl md:text-8xl leading-none relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="title-glow-teal block"
          >
            Your Year
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="title-glow-amber block"
          >
            in Time
          </motion.span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-aged-cream/70 text-xl font-body italic mb-12 max-w-md"
      >
        A personalized journey through the moments you explored
      </motion.p>

      {/* Animated VHS tracking lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-phosphor-teal/50 w-full"
            style={{ top: `${20 + i * 15}%` }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: 0.2 * i,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </motion.div>

      {/* Play Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-10 py-4 bg-crt-dark border-2 border-phosphor-teal rounded-lg
                   text-phosphor-teal led-text text-xl tracking-widest
                   hover:shadow-glow-teal transition-all"
      >
        ▶ PLAY
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-6 text-aged-cream/40 text-sm led-text tracking-wider"
      >
        PRESS PLAY OR SWIPE TO BEGIN
      </motion.p>
    </motion.div>
  )
}
