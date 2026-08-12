import React, { useEffect, useRef, useState } from 'react'

interface RollingCounterProps {
  value: string
  className?: string
  duration?: number
}

export function RollingCounter({ value, className = '', duration = 2200 }: RollingCounterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const chars = value.split('')
  let digitCount = 0

  // 3 sets of digits 0..9 (30 items total)
  const digitList = Array.from({ length: 30 }, (_, i) => i % 10)

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center overflow-hidden h-[1.3em] leading-none select-none align-baseline [font-variant-numeric:tabular-nums] ${className}`}
    >
      {chars.map((char, idx) => {
        const isDigit = /\d/.test(char)
        if (!isDigit) {
          return (
            <span key={idx} className="inline-flex h-[1.3em] items-center px-[0.02em]">
              {char}
            </span>
          )
        }

        const digit = parseInt(char, 10)
        const currentDigitIndex = digitCount
        digitCount++

        // Extra rotations so rightmost digits spin longer
        const extraRotations = currentDigitIndex === 0 ? 1 : currentDigitIndex === 1 ? 1 : 2
        const targetIndex = extraRotations * 10 + digit
        const totalItems = digitList.length
        const translatePercent = (targetIndex / totalItems) * 100
        const delay = currentDigitIndex * 120 // staggered delay in ms

        return (
          <span
            key={idx}
            className="relative inline-block h-[1.3em] overflow-hidden"
          >
            <span
              className="flex flex-col transition-transform ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: isVisible
                  ? `translateY(-${translatePercent}%)`
                  : 'translateY(0%)',
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
              }}
            >
              {digitList.map((num, dIdx) => (
                <span
                  key={dIdx}
                  className="flex h-[1.3em] items-center justify-center"
                >
                  {num}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function AnimatedProgress({ value, className = '', duration = 1500, delay = 300 }: { value: number; className?: string; duration?: number; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
      <div
        className="h-full rounded-full bg-primary ease-out"
        style={{
          width: isVisible ? `${value}%` : '0%',
          transitionProperty: 'width',
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}
