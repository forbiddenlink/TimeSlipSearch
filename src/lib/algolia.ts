import { algoliasearch, SearchClient } from 'algoliasearch'

let _client: SearchClient | null = null

function getClient(): SearchClient {
  if (!_client) {
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
    const apiKey = process.env.ALGOLIA_SEARCH_API_KEY

    if (!appId || !apiKey) {
      throw new Error('Algolia credentials not configured. Set NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_SEARCH_API_KEY in .env.local')
    }

    _client = algoliasearch(appId, apiKey)
  }
  return _client
}

export interface Song {
  objectID: string
  date: number
  date_string: string
  year: number
  decade: string
  chart_position: number
  song_title: string
  artist: string
  weeks_on_chart?: number
  peak_position?: number
  category: 'music'
}

export interface Movie {
  objectID: string
  tmdb_id?: number
  date: number
  date_string: string
  year: number
  decade: string
  title: string
  overview?: string
  genres?: string[]
  poster_url?: string
  vote_average: number
  popularity?: number
  category: 'movies'
}

export interface Price {
  objectID: string
  date: number
  date_string: string
  year: number
  decade: string
  month: string
  gas_price_gallon?: number
  cpi_index?: number
  minimum_wage?: number
  movie_ticket_price?: number
  inflation_rate?: number
  category: 'prices'
}

export interface HistoricalEvent {
  objectID: string
  date: number
  date_string: string
  year: number
  decade: string
  event_type?: string
  title: string
  description?: string
  category: 'events'
  subcategory?: string
  importance?: string
}

export interface SearchResults {
  songs: Song[]
  movies: Movie[]
  prices: Price[]
  events: HistoricalEvent[]
}

export interface AdvancedSearchOptions {
  decades?: string[]
  chartPositions?: string[]
  showOnlyNumber1?: boolean
}

// Attributes to retrieve per index (reduces payload size)
const SONG_ATTRIBUTES = [
  'objectID', 'date', 'date_string', 'year', 'decade',
  'chart_position', 'song_title', 'artist', 'weeks_on_chart', 'peak_position', 'category'
]

const MOVIE_ATTRIBUTES = [
  'objectID', 'tmdb_id', 'date', 'date_string', 'year', 'decade',
  'title', 'overview', 'genres', 'poster_url', 'vote_average', 'popularity', 'category'
]

const EVENT_ATTRIBUTES = [
  'objectID', 'date', 'date_string', 'year', 'decade',
  'event_type', 'title', 'description', 'category', 'importance'
]

/**
 * Search all TimeSlipSearch indices for a date range with advanced filters
 * Uses batched multi-index search for efficiency (single HTTP request)
 */
export async function searchAllIndices(
  startTimestamp: number,
  endTimestamp: number,
  options?: AdvancedSearchOptions
): Promise<SearchResults> {
  let baseFilters = `date >= ${startTimestamp} AND date <= ${endTimestamp}`

  // Add decade filters if specified
  if (options?.decades && options.decades.length > 0) {
    const decadeFilters = options.decades.map(d => `decade:"${d}"`).join(' OR ')
    baseFilters += ` AND (${decadeFilters})`
  }

  // Build song-specific filters (chart position only applies to songs)
  let songFilters = baseFilters
  if (options?.showOnlyNumber1) {
    songFilters += ' AND chart_position:1'
  } else if (options?.chartPositions && options.chartPositions.length > 0) {
    if (options.chartPositions.includes('top10')) {
      songFilters += ' AND chart_position <= 10'
    } else if (options.chartPositions.includes('top40')) {
      songFilters += ' AND chart_position <= 40'
    }
  }

  console.log('[Algolia] Searching with filters:', baseFilters)

  try {
    const client = getClient()

    // Single batched request to all indices (1 HTTP call instead of 4)
    const response = await client.search({
      requests: [
        {
          indexName: 'timeslip_songs',
          query: '',
          filters: songFilters,
          hitsPerPage: 5,
          attributesToRetrieve: SONG_ATTRIBUTES,
        },
        {
          indexName: 'timeslip_movies',
          query: '',
          filters: baseFilters,
          hitsPerPage: 3,
          attributesToRetrieve: MOVIE_ATTRIBUTES,
        },
        {
          indexName: 'timeslip_prices',
          query: '',
          filters: baseFilters,
          hitsPerPage: 1,
          attributesToRetrieve: ['*'], // Small payload, retrieve all
        },
        {
          indexName: 'timeslip_events',
          query: '',
          filters: baseFilters,
          hitsPerPage: 3,
          attributesToRetrieve: EVENT_ATTRIBUTES,
        },
      ],
    })

    // Extract hits from each result (type assertions needed due to Algolia's union types)
    const results = response.results as Array<{ hits: unknown[]; nbHits: number }>
    const [songsResponse, moviesResponse, pricesResponse, eventsResponse] = results

    console.log('[Algolia] Songs found:', songsResponse?.nbHits ?? 0)
    console.log('[Algolia] Movies found:', moviesResponse?.nbHits ?? 0)
    console.log('[Algolia] Prices found:', pricesResponse?.nbHits ?? 0)
    console.log('[Algolia] Events found:', eventsResponse?.nbHits ?? 0)

    return {
      songs: ((songsResponse?.hits ?? []) as Song[]).sort(
        (a, b) => a.chart_position - b.chart_position
      ),
      movies: ((moviesResponse?.hits ?? []) as Movie[]).sort(
        (a, b) => (b.popularity || 0) - (a.popularity || 0)
      ),
      prices: (pricesResponse?.hits ?? []) as Price[],
      events: (eventsResponse?.hits ?? []) as HistoricalEvent[],
    }
  } catch (error) {
    console.error('[Algolia] Search error:', error)
    return {
      songs: [],
      movies: [],
      prices: [],
      events: [],
    }
  }
}

/**
 * Get the admin client for indexing operations
 */
export function getAdminClient() {
  return algoliasearch(
    process.env.ALGOLIA_APP_ID || '',
    process.env.ALGOLIA_ADMIN_API_KEY || ''
  )
}
