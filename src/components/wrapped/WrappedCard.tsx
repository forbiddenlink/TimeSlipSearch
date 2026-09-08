'use client'

import { motion } from 'motion/react'
import { getPersonalityDescription, type WrappedStats } from '@/lib/wrapped'
import { ShareIcon, CopyIcon, XIcon } from '@/components/icons/Icons'

interface WrappedCardProps {
  stats: WrappedStats
  onClose?: () => void
}

export function WrappedCard({ stats, onClose }: WrappedCardProps) {
  const personality = getPersonalityDescription(stats.personality)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Card */}
        <div className="retro-wrapped-bg rounded-2xl shadow-2xl p-8 text-aged-cream border border-crt-light/40 overflow-hidden">
          {/* VHS Label Strip */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-crt-light/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-vhs-red animate-pulse" />
              <span className="led-text text-vhs-red text-xs tracking-widest">PLAYBACK SUMMARY</span>
            </div>
            <span className="led-text text-aged-cream/60 text-xs">TIMESLIP v1.0</span>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-aged-cream/50 hover:text-phosphor-teal transition-colors p-2 bg-crt-black/50 hover:bg-crt-black rounded-full"
              aria-label="Close"
            >
              <XIcon size={20} />
            </button>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-5xl md:text-6xl mb-3">
              <span className="title-glow-teal">Your Time</span>{' '}
              <span className="title-glow-amber">Capsule</span>
            </h1>
            <p className="text-lg text-aged-cream/60 italic font-body">A Journey Through Time</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-crt-dark border border-crt-light/40 rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-1 led-text text-phosphor-teal">{stats.totalSearches}</div>
              <div className="text-sm text-aged-cream/50 led-text tracking-wider">Time Travels</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-crt-dark border border-crt-light/40 rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-1 led-text text-phosphor-teal">{stats.yearsExplored.length}</div>
              <div className="text-sm text-aged-cream/50 led-text tracking-wider">Years Explored</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-crt-dark border border-crt-light/40 rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-1 led-text text-phosphor-teal">{stats.discoveries.totalSongs}</div>
              <div className="text-sm text-aged-cream/50 led-text tracking-wider">Songs Discovered</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-crt-dark border border-crt-light/40 rounded-lg p-6 text-center"
            >
              <div className="text-4xl font-bold mb-1 led-text text-phosphor-teal">{stats.discoveries.totalMovies}</div>
              <div className="text-sm text-aged-cream/50 led-text tracking-wider">Movies Found</div>
            </motion.div>
          </div>

          {/* Top Decade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-crt-dark border border-crt-light/40 rounded-lg p-6 mb-6"
          >
            <div className="text-center">
              <div className="text-lg text-aged-cream/60 led-text tracking-widest mb-2">Your Favorite Era</div>
              <div className="text-5xl font-bold mb-2 led-text text-phosphor-amber">{stats.topDecade}</div>
              {stats.discoveries.rarestYear && (
                <div className="text-sm text-aged-cream/60 led-text">
                  Rarest Find: {stats.discoveries.rarestYear}
                </div>
              )}
            </div>
          </motion.div>

          {/* Personality */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-crt-dark border border-phosphor-teal/30 rounded-lg p-8 mb-6 text-center"
          >
            <div className="text-6xl mb-4">{personality.emoji}</div>
            <h3 className="text-2xl font-bold mb-2 font-display text-phosphor-teal">{personality.title}</h3>
            <p className="text-aged-cream/70 leading-relaxed font-body italic">{personality.description}</p>
          </motion.div>

          {/* Favorite Items */}
          {(stats.discoveries.favoriteSong || stats.discoveries.favoriteMovie) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4 mb-6"
            >
              {stats.discoveries.favoriteSong && (
                <div className="bg-crt-dark border border-crt-light/40 rounded-lg p-4">
                  <div className="text-sm text-phosphor-amber led-text tracking-widest mb-1">Top Song</div>
                  <div className="font-display text-lg text-aged-cream">{stats.discoveries.favoriteSong.song_title}</div>
                  <div className="text-sm text-aged-cream/50 font-body italic">{stats.discoveries.favoriteSong.artist}</div>
                </div>
              )}

              {stats.discoveries.favoriteMovie && (
                <div className="bg-crt-dark border border-crt-light/40 rounded-lg p-4">
                  <div className="text-sm text-phosphor-amber led-text tracking-widest mb-1">Top Movie</div>
                  <div className="font-display text-lg text-aged-cream">{stats.discoveries.favoriteMovie.title}</div>
                  <div className="text-sm text-aged-cream/50 font-body italic">
                    {stats.discoveries.favoriteMovie.year}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Share Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-3"
          >
            <button
              onClick={() => {
                const text = `Check out my Time Capsule! 🚀 I've explored ${stats.yearsExplored.length} years and discovered ${stats.discoveries.totalSongs} songs from the ${stats.topDecade}!`
                if (navigator.share) {
                  navigator.share({
                    title: 'My Time Capsule',
                    text: text,
                    url: typeof window !== 'undefined' ? window.location.href : '',
                  }).catch(() => { })
                } else {
                  navigator.clipboard.writeText(text)
                  alert('Copied to clipboard!')
                }
              }}
              className="px-6 py-3 bg-crt-dark border border-phosphor-teal/40 rounded-lg led-text tracking-wider transition-all flex items-center gap-2 hover:border-phosphor-teal hover:shadow-glow-teal hover:scale-105 text-phosphor-teal"
            >
              <ShareIcon size={18} />
              Share
            </button>
            <button
              onClick={() => {
                // Simple copy stats to clipboard
                const text = `🎁 My Time Capsule\n\n🔍 ${stats.totalSearches} searches\n📅 ${stats.yearsExplored.length} years explored\n🎵 ${stats.discoveries.totalSongs} songs discovered\n🎬 ${stats.discoveries.totalMovies} movies found\n⭐ Favorite Era: ${stats.topDecade}\n👤 Personality: ${getPersonalityDescription(stats.personality).title}`
                navigator.clipboard.writeText(text)
                alert('Stats copied to clipboard!')
              }}
              className="px-6 py-3 bg-crt-dark border border-phosphor-teal/40 rounded-lg led-text tracking-wider transition-all flex items-center gap-2 hover:border-phosphor-teal hover:shadow-glow-teal hover:scale-105 text-phosphor-teal"
            >
              <CopyIcon size={18} />
              Copy Stats
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
