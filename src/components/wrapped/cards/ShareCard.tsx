'use client'

import { motion } from 'motion/react'
import { getPersonalityDescription, type WrappedStats } from '@/lib/wrapped'
import { downloadWrappedImage } from '@/lib/share'
import { ShareIcon, CopyIcon, DownloadIcon } from '@/components/icons/Icons'

interface ShareCardProps {
  stats: WrappedStats
  onClose: () => void
}

export function ShareCard({ stats, onClose }: Readonly<ShareCardProps>) {
  const personality = getPersonalityDescription(stats.personality)

  const handleShare = async () => {
    const text = `My TimeSlip Wrapped 🎁\n\n${personality.emoji} I'm a ${personality.title}!\n\n🔍 ${stats.totalSearches} time travels\n📅 ${stats.yearsExplored.length} years explored\n🎵 ${stats.discoveries.totalSongs} songs discovered\n⭐ Favorite Era: ${stats.topDecade}\n\nExplore your own timeline at timeslipsearch.vercel.app`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TimeSlip Wrapped',
          text,
          url: 'https://timeslipsearch.vercel.app',
        })
      } catch {
        // User cancelled or share failed, fall back to clipboard
        await navigator.clipboard.writeText(text)
        alert('Copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  const handleCopyStats = async () => {
    const text = `🎁 My TimeSlip Wrapped

${personality.emoji} ${personality.title}
"${personality.description}"

📊 Stats:
• ${stats.totalSearches} searches
• ${stats.yearsExplored.length} years explored
• ${stats.discoveries.totalSongs} songs discovered
• ${stats.discoveries.totalMovies} movies found
• Favorite Era: ${stats.topDecade}

🌐 timeslipsearch.vercel.app`

    await navigator.clipboard.writeText(text)
    alert('Stats copied to clipboard!')
  }

  const handleDownload = async () => {
    const success = await downloadWrappedImage({
      personality: stats.personality,
      emoji: personality.emoji,
      title: personality.title,
      topDecade: stats.topDecade,
      totalSearches: stats.totalSearches,
      yearsExplored: stats.yearsExplored.length,
      totalSongs: stats.discoveries.totalSongs,
    }, 'twitter')

    if (!success) {
      // Fallback to text download if image generation fails
      const text = `TimeSlip Wrapped - ${personality.title}

Your Stats:
- ${stats.totalSearches} Time Travels
- ${stats.yearsExplored.length} Years Explored
- ${stats.discoveries.totalSongs} Songs Discovered
- ${stats.discoveries.totalMovies} Movies Found
- Favorite Era: ${stats.topDecade}

${personality.description}

Generated at timeslipsearch.vercel.app`

      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'timeslip-wrapped.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center"
    >
      {/* Celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="text-7xl mb-6"
      >
        🎉
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-4xl md:text-5xl mb-4"
      >
        <span className="title-glow-teal">That&apos;s a Wrap!</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-aged-cream/70 text-lg font-body italic mb-8 max-w-md"
      >
        Share your time-traveling adventures with friends
      </motion.p>

      {/* Share Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        <button
          onClick={handleShare}
          className="px-6 py-3 bg-crt-dark border border-phosphor-teal rounded-lg
                     led-text tracking-wider transition-all flex items-center gap-2
                     hover:border-phosphor-teal hover:shadow-glow-teal hover:scale-105
                     text-phosphor-teal"
        >
          <ShareIcon size={18} />
          Share
        </button>

        <button
          onClick={handleCopyStats}
          className="px-6 py-3 bg-crt-dark border border-phosphor-amber/60 rounded-lg
                     led-text tracking-wider transition-all flex items-center gap-2
                     hover:border-phosphor-amber hover:shadow-glow-amber hover:scale-105
                     text-phosphor-amber"
        >
          <CopyIcon size={18} />
          Copy Stats
        </button>

        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-crt-dark border border-aged-cream/40 rounded-lg
                     led-text tracking-wider transition-all flex items-center gap-2
                     hover:border-aged-cream hover:scale-105
                     text-aged-cream/80"
        >
          <DownloadIcon size={18} />
          Download
        </button>
      </motion.div>

      {/* Mini Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-crt-dark border border-crt-light/30 rounded-lg p-6 max-w-sm w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{personality.emoji}</span>
          <div className="text-left">
            <div className="font-display text-lg text-phosphor-teal">{personality.title}</div>
            <div className="text-sm text-phosphor-amber led-text">{stats.topDecade} Era</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-xl font-bold text-aged-cream">{stats.totalSearches}</div>
            <div className="text-xs text-aged-cream/50 led-text">searches</div>
          </div>
          <div>
            <div className="text-xl font-bold text-aged-cream">{stats.yearsExplored.length}</div>
            <div className="text-xs text-aged-cream/50 led-text">years</div>
          </div>
          <div>
            <div className="text-xl font-bold text-aged-cream">{stats.discoveries.totalSongs}</div>
            <div className="text-xs text-aged-cream/50 led-text">songs</div>
          </div>
        </div>
      </motion.div>

      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onClose}
        className="mt-8 px-8 py-3 bg-phosphor-teal/20 border border-phosphor-teal rounded-lg
                   text-phosphor-teal led-text tracking-widest
                   hover:bg-phosphor-teal/30 transition-all"
      >
        CLOSE
      </motion.button>
    </motion.div>
  )
}
