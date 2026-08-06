/**
 * Special-collections "reading room" helpers.
 *
 * Pure, framework-free utilities shared by the Timeline (era color-temp shift)
 * and the result cards (catalog-card accession numbers). No side effects, no
 * business logic — deriving display metadata from data that already exists.
 */

export interface Era {
  /** Decade floor, e.g. 1960 */
  decade: number
  /** Human decade label, e.g. "1960s" */
  decadeLabel: string
  /** Format / medium name used as the era's "signature" */
  medium: string
  /** Color-temperature overlay tint (rgba) crossfaded on the timeline */
  tint: string
  /** Label ink color for the era */
  ink: string
  /** Typographic voice for the era */
  font: string
}

// Warm sepia serif (late 50s/60s) -> neon VHS mono (80s/90s) -> cleaner cool serif (2010s+).
const ERAS: Record<number, Era> = {
  1950: {
    decade: 1950,
    decadeLabel: '1950s',
    medium: 'Silver Gelatin',
    tint: 'rgba(212, 165, 116, 0.30)',
    ink: '#d9a000',
    font: "'Playfair Display', Georgia, serif",
  },
  1960: {
    decade: 1960,
    decadeLabel: '1960s',
    medium: 'Kodachrome',
    tint: 'rgba(212, 165, 116, 0.26)',
    ink: '#ffbf00',
    font: "'Playfair Display', Georgia, serif",
  },
  1970: {
    decade: 1970,
    decadeLabel: '1970s',
    medium: 'Ektachrome',
    tint: 'rgba(199, 62, 58, 0.22)',
    ink: '#e74c46',
    font: "'Playfair Display', Georgia, serif",
  },
  1980: {
    decade: 1980,
    decadeLabel: '1980s',
    medium: 'Betamax',
    tint: 'rgba(64, 224, 208, 0.20)',
    ink: '#40e0d0',
    font: "'VT323', 'Courier New', monospace",
  },
  1990: {
    decade: 1990,
    decadeLabel: '1990s',
    medium: 'VHS',
    tint: 'rgba(255, 49, 49, 0.20)',
    ink: '#5ffff0',
    font: "'VT323', 'Courier New', monospace",
  },
  2000: {
    decade: 2000,
    decadeLabel: '2000s',
    medium: 'MiniDV',
    tint: 'rgba(65, 105, 225, 0.18)',
    ink: '#40e0d0',
    font: "'Source Serif 4', Georgia, serif",
  },
  2010: {
    decade: 2010,
    decadeLabel: '2010s',
    medium: 'HD Digital',
    tint: 'rgba(64, 224, 208, 0.12)',
    ink: '#5ffff0',
    font: "'Source Serif 4', Georgia, serif",
  },
  2020: {
    decade: 2020,
    decadeLabel: '2020s',
    medium: '4K Restore',
    tint: 'rgba(232, 224, 213, 0.10)',
    ink: '#e8e0d5',
    font: "'Source Serif 4', Georgia, serif",
  },
}

/** Resolve the era for a given year (clamped to the archive's real span). */
export function getEra(year: number): Era {
  const clamped = Math.min(2020, Math.max(1958, year))
  const decade = Math.floor(clamped / 10) * 10
  return ERAS[decade] ?? ERAS[1960]!
}

/** Ordered decade "chapters" for the decade-spine quick-nav (start year per decade). */
export const DECADE_CHAPTERS: ReadonlyArray<{ start: number; label: string; medium: string }> = [
  { start: 1958, label: "'50s", medium: ERAS[1950]!.medium },
  { start: 1960, label: "'60s", medium: ERAS[1960]!.medium },
  { start: 1970, label: "'70s", medium: ERAS[1970]!.medium },
  { start: 1980, label: "'80s", medium: ERAS[1980]!.medium },
  { start: 1990, label: "'90s", medium: ERAS[1990]!.medium },
  { start: 2000, label: "'00s", medium: ERAS[2000]!.medium },
  { start: 2010, label: "'10s", medium: ERAS[2010]!.medium },
  { start: 2020, label: "'20s", medium: ERAS[2020]!.medium },
]

const CATEGORY_CODES: Record<string, string> = {
  music: 'MUS',
  movies: 'FLM',
  events: 'EVT',
  prices: 'PRC',
}

/**
 * Deterministic catalog accession number, e.g. "TSS-MUS-1987-4213".
 * Stable per record so the "card catalog" reads like a real archive index.
 */
export function accessionNumber(
  objectID: string,
  category: string,
  year?: number
): string {
  let hash = 0
  for (let i = 0; i < objectID.length; i++) {
    hash = (hash * 31 + objectID.charCodeAt(i)) >>> 0
  }
  const serial = (hash % 10000).toString().padStart(4, '0')
  const code = CATEGORY_CODES[category] ?? 'GEN'
  const yr = year ?? '0000'
  return `TSS-${code}-${yr}-${serial}`
}
