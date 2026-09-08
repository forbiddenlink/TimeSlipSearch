'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface ParticleEffectProps {
  isActive?: boolean
}

export function ParticleEffect({ isActive = true }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    // Create initial particles - more numerous but smaller/subtler
    const initialParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2, // Slower movement
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 1, // 1-4px size
      opacity: Math.random() * 0.5 + 0.1, // 0.1 - 0.6 opacity
    }))

    setParticles(initialParticles)

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + particle.vx
          let newY = particle.y + particle.vy
          let newVx = particle.vx
          let newVy = particle.vy

          // Wrap around edges for continuous flow
          if (newX < -5) newX = 105
          if (newX > 105) newX = -5
          if (newY < -5) newY = 105
          if (newY > 105) newY = -5

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-aged-cream"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 253, 208, 0.3)`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: particle.opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 1.5 }}
        />
      ))}
    </div>
  )
}

interface ConfettiEffectProps {
  isActive?: boolean
  duration?: number
}

interface ParticleBurstProps {
  isActive?: boolean
  duration?: number
  onComplete?: () => void
}

export function ParticleBurst({ isActive = false, duration = 1500, onComplete }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    angle: number
    velocity: number
    color: string
    size: number
  }>>([])

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    // Teal and amber colors for the burst
    const colors = ['#4ECDC4', '#45B7D1', '#F7DC6F', '#FFD93D', '#6FFFE9', '#5EEAD4']

    // Create particles radiating from center
    const burstParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 50, // Start from center
      y: 50,
      angle: (i / 30) * Math.PI * 2, // Radiate in all directions
      velocity: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#4ECDC4',
      size: 3 + Math.random() * 4,
    }))

    setParticles(burstParticles)

    const timer = setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [isActive, duration, onComplete])

  if (!isActive || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos(particle.angle) * particle.velocity * 100,
            y: Math.sin(particle.angle) * particle.velocity * 100,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: duration / 1000,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

export function ConfettiEffect({ isActive = false, duration = 3000 }: ConfettiEffectProps) {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([])

  useEffect(() => {
    if (!isActive) {
      setPieces([])
      return
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

    const confetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#FFF',
    }))

    setPieces(confetti)

    const timer = setTimeout(() => {
      setPieces([])
    }, duration)

    return () => clearTimeout(timer)
  }, [isActive, duration])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${piece.x}%`,
            top: '-10%',
            backgroundColor: piece.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: 720,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}
