'use client'

import { motion } from 'motion/react'
import type { WrappedStats } from '@/lib/wrapped'

interface TopItemsCardProps {
  stats: WrappedStats
  onNext: () => void
}

export function TopItemsCard({ stats, onNext }: Readonly<TopItemsCardProps>) {
  const { discoveries } = stats

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
        <span className="title-glow-amber">Your Favorites</span>
      </motion.h2>

      <div className="space-y-6 w-full max-w-md">
        {/* Favorite Song */}
        {discoveries.favoriteSong && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-crt-dark border border-vinyl-label-bright/40 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="text-4xl"
              >
                💿
              </motion.span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-vinyl-label-bright led-text tracking-widest mb-1">
                  TOP SONG
                </div>
                <div className="font-display text-xl text-aged-cream truncate">
                  {discoveries.favoriteSong.song_title}
                </div>
                <div className="text-sm text-aged-cream/50 font-body italic truncate">
                  {discoveries.favoriteSong.artist}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Favorite Movie */}
        {discoveries.favoriteMovie && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-crt-dark border border-phosphor-amber/40 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎬</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-phosphor-amber led-text tracking-widest mb-1">
                  TOP MOVIE
                </div>
                <div className="font-display text-xl text-aged-cream truncate">
                  {discoveries.favoriteMovie.title}
                </div>
                <div className="text-sm text-aged-cream/50 font-body italic">
                  {discoveries.favoriteMovie.year}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rarest Year */}
        {discoveries.rarestYear && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-crt-dark border border-phosphor-teal/40 rounded-lg p-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🔮</span>
              <div className="flex-1">
                <div className="text-sm text-phosphor-teal led-text tracking-widest mb-1">
                  RAREST FIND
                </div>
                <div className="font-display text-2xl text-phosphor-teal">
                  {discoveries.rarestYear}
                </div>
                <div className="text-sm text-aged-cream/50 led-text">
                  Few explore this year
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fallback if no favorites */}
        {!discoveries.favoriteSong && !discoveries.favoriteMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-8"
          >
            <span className="text-5xl mb-4 block">🎭</span>
            <p className="text-aged-cream/60 font-body italic">
              Keep exploring to discover your favorites!
            </p>
          </motion.div>
        )}
      </div>

      {/* Continue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onNext}
        className="mt-8 text-phosphor-teal/60 hover:text-phosphor-teal led-text text-sm tracking-wider
                   transition-colors flex items-center gap-2"
      >
        TAP TO CONTINUE →
      </motion.button>
    </motion.div>
  )
}
