import React, { useEffect, useRef, useState } from 'react'

interface SevaLoaderProps {
  progress?: number
  tagline?: string
  fullScreen?: boolean
  className?: string
  durationMs?: number
  onComplete?: () => void
}

export function SevaLoader({
  progress: externalProgress,
  tagline = 'Loading kindness, one kilometer at a time.',
  fullScreen = false,
  className = '',
  durationMs = 3600,
  onComplete
}: SevaLoaderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const truckRef = useRef<SVGSVGElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    let animationFrameId: number
    let start: number | null = null

    const loop = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start

      let pct = 0
      if (typeof externalProgress === 'number') {
        pct = Math.min(100, Math.max(0, externalProgress))
      } else {
        pct = Math.min(100, (elapsed / durationMs) * 100)
      }

      const roundedPct = Math.round(pct)
      if (pctRef.current) {
        pctRef.current.textContent = `${roundedPct}%`
      }
      setDisplayPct(roundedPct)

      // Direct DOM updates for 60fps frame-perfect synchronization
      if (trackRef.current) {
        const trackWidth = trackRef.current.clientWidth
        const truckWidth = 86
        const fillPx = (pct / 100) * trackWidth

        if (fillRef.current) {
          fillRef.current.style.width = `${pct}%`
        }

        if (truckRef.current) {
          // Align fill edge with front wheel (x = 63px offset in 86px SVG)
          let left = fillPx - 63
          if (left < 0) left = 0
          if (left > trackWidth - truckWidth) left = trackWidth - truckWidth
          truckRef.current.style.left = `${left}px`
        }
      }

      if (typeof externalProgress !== 'number' && elapsed < durationMs) {
        animationFrameId = requestAnimationFrame(loop)
      } else if (typeof externalProgress !== 'number' && elapsed >= durationMs) {
        if (fillRef.current) fillRef.current.style.width = '100%'
        if (pctRef.current) pctRef.current.textContent = '100%'
        if (truckRef.current && trackRef.current) {
          const trackWidth = trackRef.current.clientWidth
          truckRef.current.style.left = `${trackWidth - 86}px`
        }
        if (onComplete) onComplete()
      }
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [externalProgress, durationMs, onComplete])

  const content = (
    <div
      className={`w-full max-w-[680px] rounded-2xl p-6 sm:p-10 border border-[#F3E6C8]/15 bg-[#150E09] text-left shadow-2xl transition-all ${className}`}
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Percentage Header */}
      <div className="flex justify-end mb-2">
        <span
          ref={pctRef}
          className="text-[#F2A93B] font-mono text-sm font-semibold tracking-wider"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {displayPct}%
        </span>
      </div>

      {/* Truck & Track Container */}
      <div className="relative mb-2">
        {/* Animated Truck SVG */}
        <div className="relative h-0">
          <svg
            ref={truckRef}
            id="truck"
            width="86"
            height="42"
            viewBox="0 0 86 42"
            className="absolute -top-10 will-change-[left]"
            style={{ left: '0px' }}
          >
            {/* Truck Body */}
            <rect x="2" y="4" width="52" height="24" rx="3" fill="#F3E6C8" />
            <rect x="2" y="4" width="52" height="8" fill="#241811" />
            <rect x="7" y="13" width="42" height="13" rx="1" fill="#D65B1F" />
            <text
              x="28"
              y="22"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize="8"
              fontWeight="700"
              fill="#FBF1DE"
            >
              ARHAM
            </text>
            {/* Cabin & Window */}
            <path d="M54 28 L54 10 L64 10 L74 18 L74 28 Z" fill="#D65B1F" />
            <rect x="57" y="13" width="9" height="7" rx="1" fill="#F2A93B" />

            {/* Wheels Container */}
            <circle cx="17" cy="30" r="8" fill="#150E09" />
            <g
              className="animate-[spin_0.3s_linear_infinite]"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <circle cx="17" cy="30" r="5" fill="#241811" />
              <line x1="17" y1="25" x2="17" y2="35" stroke="#8C7A63" strokeWidth="1" />
              <line x1="12" y1="30" x2="22" y2="30" stroke="#8C7A63" strokeWidth="1" />
            </g>

            <circle cx="63" cy="30" r="8" fill="#150E09" />
            <g
              className="animate-[spin_0.3s_linear_infinite]"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <circle cx="63" cy="30" r="5" fill="#241811" />
              <line x1="63" y1="25" x2="63" y2="35" stroke="#8C7A63" strokeWidth="1" />
              <line x1="58" y1="30" x2="68" y2="30" stroke="#8C7A63" strokeWidth="1" />
            </g>
          </svg>
        </div>

        {/* Progress Track */}
        <div
          ref={trackRef}
          className="relative h-3.5 bg-[#241811] border border-[#F3E6C8]/15 rounded-md overflow-hidden"
        >
          <div
            ref={fillRef}
            className="absolute top-0 left-0 h-full bg-[#D65B1F] rounded-md will-change-[width] shadow-[0_0_12px_rgba(214,91,31,0.5)]"
            style={{ width: '0%' }}
          />
        </div>
      </div>

      {/* Subtitle / Tagline */}
      <div className="text-center text-[#8C7A63] text-sm font-medium mt-6 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
        {tagline}
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#150E09]/95 backdrop-blur-md p-4">
        {content}
      </div>
    )
  }

  return content
}

export default SevaLoader
