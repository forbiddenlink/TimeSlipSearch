'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface VHSEffectProps {
  isActive?: boolean
  intensity?: 'low' | 'medium' | 'high'
  children: React.ReactNode
}

export function VHSEffect({ isActive = false, intensity = 'medium', children }: VHSEffectProps) {
  const [scanlineOffset, setScanlineOffset] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setScanlineOffset((prev) => (prev + 1) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) {
    return <>{children}</>
  }

  const intensitySettings = {
    low: {
      noise: 0.02,
      distortion: 0.5,
      scanlines: 0.05,
    },
    medium: {
      noise: 0.05,
      distortion: 1,
      scanlines: 0.1,
    },
    high: {
      noise: 0.1,
      distortion: 2,
      scanlines: 0.15,
    },
  }

  const settings = intensitySettings[intensity]

  return (
    <div className="relative overflow-hidden">
      {/* Main Content */}
      <motion.div
        animate={{
          x: isActive ? [0, settings.distortion, -settings.distortion, 0] : 0,
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* VHS Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, ${settings.scanlines}) 0px,
            transparent 1px,
            transparent 2px,
            rgba(0, 0, 0, ${settings.scanlines}) 3px
          )`,
        }}
      />

      {/* Moving Scanline */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `linear-gradient(
            0deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) ${scanlineOffset}%,
            transparent ${scanlineOffset + 2}%
          )`,
        }}
      />

      {/* RGB Shift Effect */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-30"
        style={{
          filter: 'blur(1px)',
          transform: 'translate(1px, 0)',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(255, 0, 0, 0.1)' }} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-30"
        style={{
          filter: 'blur(1px)',
          transform: 'translate(-1px, 0)',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0, 255, 255, 0.1)' }} />
      </div>

      {/* Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
          animation: 'grain 0.5s steps(10) infinite',
        }}
      />

      <style jsx>{`
        @keyframes grain {
          0%,
          100% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-5%, -5%);
          }
          20% {
            transform: translate(-10%, 5%);
          }
          30% {
            transform: translate(5%, -10%);
          }
          40% {
            transform: translate(-5%, 15%);
          }
          50% {
            transform: translate(-10%, 5%);
          }
          60% {
            transform: translate(15%, 0%);
          }
          70% {
            transform: translate(0%, 10%);
          }
          80% {
            transform: translate(-15%, 0%);
          }
          90% {
            transform: translate(10%, 5%);
          }
        }
      `}</style>
    </div>
  )
}

interface VHSRewindEffectProps {
  onComplete?: () => void
}

export function VHSRewindEffect({ onComplete }: VHSRewindEffectProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Rewind Lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-0.5 bg-white/30"
            style={{
              top: `${(i * 100) / 20}%`,
            }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Rewind Icon */}
      <motion.div
        animate={{
          rotate: [0, -360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="text-aged-cream text-6xl z-10"
      >
        ⏪
      </motion.div>

      {/* Glitch Text */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-aged-cream text-2xl font-mono"
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
        }}
      >
        REWINDING...
      </motion.div>
    </motion.div>
  )
}
