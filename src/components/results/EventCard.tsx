import { memo } from 'react'
import type { HistoricalEvent } from '@/lib/algolia'

interface EventCardProps {
  event: HistoricalEvent
}

function getEventIcon(eventType?: string): { icon: string; color: string } {
  switch (eventType) {
    case 'birth':
      return { icon: '★', color: 'text-phosphor-green' }
    case 'death':
      return { icon: '†', color: 'text-aged-cream/50' }
    case 'selected':
      return { icon: '◆', color: 'text-phosphor-amber' }
    default:
      return { icon: '•', color: 'text-phosphor-teal' }
  }
}

export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  const { icon, color } = getEventIcon(event.event_type)

  return (
    <div className="aged-paper rounded p-3 hover:shadow-lg transition-shadow group relative overflow-hidden">
      {/* Torn paper edge effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-aged-sepia/30 to-transparent" />

      <div className="relative z-10 flex items-start gap-3">
        {/* Event type indicator */}
        <span className={`text-lg flex-shrink-0 ${color} font-serif`}>
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          {/* Title - typewriter style */}
          <h4 className="font-display text-base text-crt-dark leading-snug">
            {event.title}
          </h4>

          {/* Description */}
          {event.description && event.description !== event.title && (
            <p className="text-sm text-crt-medium mt-1 line-clamp-2 font-body italic">
              {event.description}
            </p>
          )}
        </div>

        {/* Year stamp */}
        <div className="flex-shrink-0">
          <span className="led-text text-crt-dark/60 text-xs px-2 py-0.5 bg-aged-sepia/20 rounded">
            {event.year}
          </span>
        </div>
      </div>
    </div>
  )
})

interface EventListProps {
  events: HistoricalEvent[]
  title?: string
}

export function EventList({ events, title = 'What Happened' }: EventListProps) {
  if (events.length === 0) return null

  // Prioritize "selected" events
  const sortedEvents = [...events].sort((a, b) => {
    if (a.importance === 'major' && b.importance !== 'major') return -1
    if (b.importance === 'major' && a.importance !== 'major') return 1
    return 0
  })

  return (
    <div className="space-y-3">
      {/* Section header - newspaper headline style */}
      <div className="flex items-center gap-3 pb-2 border-b border-crt-light/20">
        <div className="aged-paper px-2 py-1 rounded">
          <span className="text-crt-dark text-lg font-display">◆</span>
        </div>
        <div>
          <h3 className="font-display text-xl text-aged-cream">
            {title}
          </h3>
          <p className="led-text text-phosphor-teal text-xs tracking-widest">
            HEADLINES
          </p>
        </div>
      </div>

      {/* Event list - newspaper clipping stack */}
      <div className="space-y-2">
        {sortedEvents.slice(0, 4).map((event, index) => (
          <div
            key={event.objectID}
            className="transform transition-transform hover:-translate-y-0.5 cascade-in"
            style={{
              animationDelay: `${0.4 + index * 0.1}s`,
              marginLeft: `${index * 2}px`,
            }}
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  )
}
