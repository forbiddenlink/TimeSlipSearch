/** @jest-environment node */
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST } from '../../src/app/api/chat/route'
import { parseDate } from '../../src/lib/date-parser'
import { searchAllIndices } from '../../src/lib/algolia'
import { checkRateLimit } from '../../src/lib/rate-limit'
import { getCache, setCache } from '../../src/lib/cache'

jest.mock('../../src/lib/algolia', () => ({ searchAllIndices: jest.fn() }))
jest.mock('../../src/lib/rate-limit', () => ({ checkRateLimit: jest.fn(), getClientIdentifier: () => 'test-client' }))
jest.mock('../../src/lib/cache', () => ({
  getCache: jest.fn(), setCache: jest.fn(), createCacheKey: () => 'test-cache', CACHE_TTL: { SEARCH_RESULTS: 3600 },
}))

const results = {
  songs: [{ objectID: '1', chart_position: 1, song_title: 'Lean on Me', artist: 'Club Nouveau', weeks_on_chart: 20 }],
  movies: [], prices: [], events: [],
}
function request(body: unknown): NextRequest {
  return new NextRequest('https://example.com/api/chat', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
}

describe('Chat API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 29, resetAt: 2000000000000 })
    jest.mocked(searchAllIndices).mockResolvedValue(results as never)
    jest.mocked(getCache).mockResolvedValue(null)
  })

  it.each([{ message: '' }, { message: 123 }, { message: 'a'.repeat(501) }, { message: '1987', filters: null }])('rejects invalid input %j without searching', async (body) => {
    expect((await POST(request(body))).status).toBe(400)
    expect(searchAllIndices).not.toHaveBeenCalled()
  })

  it('returns formatted search results and forwards filters', async () => {
    const filters = { decades: ['1980s'], showOnlyNumber1: true }
    const response = await POST(request({ message: 'March 15, 1987', filters }))
    const body = await response.json()
    const date = parseDate('March 15, 1987')!
    expect(response.status).toBe(200)
    expect(searchAllIndices).toHaveBeenCalledWith(date.start, date.end, { ...filters, chartPositions: undefined })
    expect(body.response).toContain('#1: "Lean on Me" by Club Nouveau')
    expect(body.structured.results).toEqual(results)
    expect(body.structured.suggestions).toContain('Explore more of the 1980s')
    expect(body.structured.insights).toContain('💿 #1 song stayed on charts for 20 weeks!')
    expect(setCache).toHaveBeenCalledWith('test-cache', results, 3600)
    expect(response.headers.get('X-Cache')).toBe('MISS')
  })

  it('uses cached results without an external search', async () => {
    jest.mocked(getCache).mockResolvedValueOnce(results)
    const response = await POST(request({ message: '1987' }))
    expect(response.headers.get('X-Cache')).toBe('HIT')
    expect((await response.json()).structured.results).toEqual(results)
    expect(searchAllIndices).not.toHaveBeenCalled()
  })

  it('enforces the rate limit before search', async () => {
    jest.mocked(checkRateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, resetAt: 2000000000000 })
    const response = await POST(request({ message: '1987' }))
    expect(response.status).toBe(429)
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(searchAllIndices).not.toHaveBeenCalled()
  })

  describe('Date Parsing Integration', () => {
    it('should parse "March 15, 1987"', () => {
      const result = parseDate('March 15, 1987')
      expect(result).not.toBeNull()
      expect(result?.year).toBe(1987)
    })

    it('should return null for messages without dates', () => {
      const result = parseDate('hello world')
      expect(result).toBeNull()
    })

    it('should parse decade patterns', () => {
      const result = parseDate('the 80s')
      expect(result).not.toBeNull()
      expect(result?.year).toBe(1980)
    })

    it('should parse era patterns', () => {
      const result = parseDate('Summer of 69')
      expect(result).not.toBeNull()
      expect(result?.year).toBe(1969)
    })
  })

})
