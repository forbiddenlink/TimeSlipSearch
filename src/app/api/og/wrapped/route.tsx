import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get wrapped stats from query params
    const emoji = searchParams.get('emoji') || '🚀'
    const title = searchParams.get('title') || 'Time Explorer'
    const topDecade = searchParams.get('decade') || '1980s'
    const searches = searchParams.get('searches') || '0'
    const years = searchParams.get('years') || '0'
    const songs = searchParams.get('songs') || '0'
    const format = searchParams.get('format') || 'twitter' // twitter, instagram, square

    // Dimensions based on format
    const dimensions = {
      twitter: { width: 1000, height: 500 },
      instagram: { width: 1080, height: 1350 },
      square: { width: 1080, height: 1080 },
    }
    const { width, height } = dimensions[format as keyof typeof dimensions] || dimensions.twitter

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            fontFamily: 'monospace',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Scanline overlay effect */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              pointerEvents: 'none',
            }}
          />

          {/* VHS Label strip at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #00d4aa 0%, #ff4444 50%, #ffc933 100%)',
            }}
          />

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '32px', color: '#ff4444', marginRight: '10px' }}>●</span>
            <span style={{ fontSize: '24px', color: '#ff4444', letterSpacing: '4px' }}>WRAPPED</span>
          </div>

          {/* Main title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <span style={{ fontSize: format === 'instagram' ? '60px' : '48px', color: '#00d4aa', textShadow: '0 0 30px #00d4aa' }}>
              TimeSlip
            </span>
            <span style={{ fontSize: format === 'instagram' ? '60px' : '48px', color: '#ffc933', marginLeft: '10px' }}>
              Search
            </span>
          </div>

          {/* Personality emoji */}
          <div
            style={{
              fontSize: format === 'instagram' ? '120px' : '80px',
              marginBottom: '20px',
            }}
          >
            {emoji}
          </div>

          {/* Personality title */}
          <div
            style={{
              fontSize: format === 'instagram' ? '48px' : '36px',
              color: '#00d4aa',
              fontWeight: 'bold',
              marginBottom: '10px',
              textShadow: '0 0 20px #00d4aa',
            }}
          >
            {title}
          </div>

          {/* Top decade */}
          {/* `{topDecade} Era` is two children (expression + text), so Satori
              requires an explicit display here. */}
          <div
            style={{
              fontSize: format === 'instagram' ? '72px' : '56px',
              display: 'flex',
              color: '#ffc933',
              fontWeight: 'bold',
              marginBottom: '40px',
              textShadow: '0 0 20px #ffc933',
            }}
          >
            {topDecade} Era
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: format === 'instagram' ? '48px' : '36px', color: '#00d4aa', fontWeight: 'bold' }}>
                {searches}
              </span>
              <span style={{ fontSize: '16px', color: '#e0d5c788', letterSpacing: '2px' }}>SEARCHES</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: format === 'instagram' ? '48px' : '36px', color: '#00d4aa', fontWeight: 'bold' }}>
                {years}
              </span>
              <span style={{ fontSize: '16px', color: '#e0d5c788', letterSpacing: '2px' }}>YEARS</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: format === 'instagram' ? '48px' : '36px', color: '#00d4aa', fontWeight: 'bold' }}>
                {songs}
              </span>
              <span style={{ fontSize: '16px', color: '#e0d5c788', letterSpacing: '2px' }}>SONGS</span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              fontSize: '18px',
              color: '#e0d5c788',
              letterSpacing: '2px',
            }}
          >
            timeslipsearch.vercel.app
          </div>
        </div>
      ),
      { width, height }
    )
  } catch (error) {
    console.error('Wrapped OG Image generation error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
