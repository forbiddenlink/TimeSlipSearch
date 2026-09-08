'use client'

import { useEffect, useState } from 'react'
import { SearchHistory, Favorites, type SearchHistoryItem, type FavoriteDate } from '@/lib/agent-memory'
import { motion, AnimatePresence } from 'motion/react'

interface AgentMemoryPanelProps {
  onSelectSearch: (query: string) => void
}

export function AgentMemoryPanel({ onSelectSearch }: AgentMemoryPanelProps) {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([])
  const [favorites, setFavorites] = useState<FavoriteDate[]>([])
  const [showHistory, setShowHistory] = useState(true)

  useEffect(() => {
    // Load on mount
    loadMemory()
  }, [])

  const loadMemory = () => {
    setRecentSearches(SearchHistory.getRecent(5))
    setFavorites(Favorites.getAll().slice(0, 5))
  }

  const clearHistory = () => {
    SearchHistory.clear()
    loadMemory()
  }

  if (recentSearches.length === 0 && favorites.length === 0) {
    return null // Don't show if no memory yet
  }

  return (
    <div className="mb-12 glass-card p-6 border border-phosphor-teal/20 animate-fade-in relative overflow-hidden group">
      {/* Subtle CRT texture background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiLz4KPC9zdmc+')] mix-blend-overlay" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex gap-6">
          <button
            onClick={() => setShowHistory(true)}
            className={`led-text text-sm tracking-widest transition-all duration-300 relative ${showHistory ? 'text-phosphor-teal glow-text-subtle' : 'text-aged-cream/40 hover:text-aged-cream/70'
              }`}
          >
            <span className="mr-2">🕐</span>
            RECENT
            <span className="ml-2 text-xs opacity-60">({recentSearches.length})</span>
            {showHistory && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-phosphor-teal shadow-glow-teal"
              />
            )}
          </button>
          <button
            onClick={() => setShowHistory(false)}
            className={`led-text text-sm tracking-widest transition-all duration-300 relative ${!showHistory ? 'text-phosphor-amber glow-text-subtle' : 'text-aged-cream/40 hover:text-aged-cream/70'
              }`}
          >
            <span className="mr-2">❤️</span>
            FAVORITES
            <span className="ml-2 text-xs opacity-60">({favorites.length})</span>
            {!showHistory && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-phosphor-amber shadow-glow-amber"
              />
            )}
          </button>
        </div>

        {showHistory && recentSearches.length > 0 && (
          <button
            onClick={clearHistory}
            className="led-text text-xs text-aged-cream/40 hover:text-vhs-red transition-colors tracking-wider flex items-center gap-1"
          >
            <span>[</span> CLEAR HISTORY <span>]</span>
          </button>
        )}
      </div>

      <div className="relative z-10 min-h-[200px]">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {recentSearches.map((search, index) => (
                <button
                  key={search.id}
                  onClick={() => onSelectSearch(search.query)}
                  className="w-full text-left px-5 py-4 bg-crt-dark/50 border border-crt-light/20 
                           rounded hover:border-phosphor-teal/50 transition-all duration-300 hover-lift
                           group relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-phosphor-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex-1">
                      <div className="text-aged-cream group-hover:text-phosphor-teal transition-colors font-medium tracking-wide">
                        {search.dateDisplay}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-aged-cream/40 led-text tracking-wider">
                          {new Date(search.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-crt-light/60">•</span>
                        <span className="text-xs text-phosphor-teal/60 font-mono">
                          {search.resultCount} findings
                        </span>
                      </div>
                    </div>
                    <div className="text-phosphor-teal opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      ▶ PLAY
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {favorites.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-crt-light/30 rounded-lg bg-crt-dark/30">
                  <div className="text-4xl mb-4 opacity-50">📼</div>
                  <div className="text-aged-cream/60 text-sm led-text tracking-widest">
                    NO FAVORITES SAVED
                  </div>
                  <div className="text-sm text-aged-cream/40 mt-2 font-mono">
                    Click the ❤️ icon on any result to save it to your collection
                  </div>
                </div>
              ) : (
                favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="px-5 py-4 bg-crt-dark/50 border border-vinyl-label/20 rounded
                             hover:border-phosphor-amber/40 transition-all duration-300 hover:shadow-lg hover:bg-crt-dark
                             group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-phosphor-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-phosphor-amber text-xs">★</span>
                          <div className="text-aged-cream font-medium tracking-wide group-hover:text-phosphor-amber transition-colors">
                            {fav.dateDisplay}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                          {fav.topSong && (
                            <div className="text-sm text-aged-cream/70 flex items-center gap-2 truncate">
                              <span className="text-vinyl-label-bright">♪</span>
                              <span>{fav.topSong}</span>
                            </div>
                          )}
                          {fav.gasPrice && (
                            <div className="text-sm text-aged-cream/70 flex items-center gap-2 font-mono">
                              <span className="text-phosphor-green">RH</span>
                              <span>Gas: ${fav.gasPrice.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          Favorites.remove(fav.id)
                          loadMemory()
                        }}
                        className="p-2 text-crt-light hover:text-vhs-red transition-colors relative z-20 group/btn"
                        title="Remove from favorites"
                        aria-label="Remove from favorites"
                      >
                        <span className="sr-only">Remove</span>
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
