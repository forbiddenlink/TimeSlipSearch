'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { XIcon } from '@/components/icons/Icons'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const shortcuts = [
  { keys: ['Cmd', 'K'], description: 'Focus search' },
  { keys: ['Cmd', 'T'], description: 'Toggle timeline' },
  { keys: ['Cmd', 'W'], description: 'Time Capsule Wrapped' },
  { keys: ['Cmd', 'B'], description: 'Achievements / Badges' },
  { keys: ['Cmd', 'E'], description: 'Toggle VHS effect' },
  { keys: ['Cmd', 'P'], description: 'Toggle particles' },
  { keys: ['Cmd', '/'], description: 'Show shortcuts' },
  { keys: ['Esc'], description: 'Clear / Close' },
  { keys: ['Up', 'Down'], description: 'Navigate suggestions' },
] as const

function KeyCap({ label }: { label: string }) {
  return (
    <span
      className="inline-block px-2.5 py-1 min-w-[2rem] text-center text-sm
        bg-gradient-to-b from-crt-medium to-crt-dark
        border border-crt-light/60 rounded
        shadow-[0_3px_0_0_#0a0908,0_4px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(232,224,213,0.1)]
        text-phosphor-teal led-text tracking-wider
        select-none"
    >
      {label}
    </span>
  )
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-lg w-full glass-card rounded-2xl shadow-crt border border-crt-light/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* === CRT Screen Bezel Header === */}
            <div className="bg-crt-dark border-b border-crt-light/20 px-6 py-4">
              {/* VHS label strip */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-crt-light/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vhs-red animate-pulse" />
                  <span className="led-text text-vhs-red text-xs tracking-widest">REC</span>
                </div>
                <span className="led-text text-aged-cream/60 text-xs tracking-widest">TIMESLIP v1.0</span>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="led-text text-phosphor-teal text-lg tracking-[0.25em] uppercase">
                  System Commands
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-aged-cream/50 hover:text-phosphor-teal transition-colors p-1.5 hover:bg-crt-light/20 rounded"
                  aria-label="Close shortcuts"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>

            {/* === Shortcuts Grid === */}
            <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto retro-scroll">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={shortcut.description}
                  className={`flex items-center justify-between py-2.5 px-3
                    border-b border-crt-light/10 last:border-b-0
                    hover:bg-crt-dark/60 rounded transition-colors
                    cascade-in stagger-${Math.min(index + 1, 8)}`}
                >
                  {/* Key combo */}
                  <div className="flex items-center gap-1.5">
                    {shortcut.keys.map((key, i) => (
                      <span key={key} className="flex items-center gap-1.5">
                        {i > 0 && (
                          <span className="text-aged-cream/30 text-xs led-text">+</span>
                        )}
                        <KeyCap label={key} />
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <span className="text-aged-cream/70 text-sm led-text tracking-wider text-right">
                    {shortcut.description}
                  </span>
                </div>
              ))}
            </div>

            {/* === Footer === */}
            <div className="bg-crt-dark border-t border-crt-light/20 px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-aged-cream/30 text-xs led-text tracking-wider">
                  PRESS ESC TO CLOSE
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-phosphor-teal/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-phosphor-amber/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-vhs-red/60" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
