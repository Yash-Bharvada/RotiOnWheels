import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Trophy, Sparkles, Zap, Flame, ShieldAlert, ArrowRight, Gauge } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Button, Badge } from './ui'

type GameState = 'START' | 'PLAYING' | 'GAMEOVER'

export function RotiGame() {
  const [gameState, setGameState] = useState<GameState>('START')
  const [score, setScore] = useState(0)
  const [distance, setDistance] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOverReason, setGameOverReason] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Game state mutable refs for 60fps canvas loop
  const stateRef = useRef({
    playing: false,
    carX: 100,
    carY: 200,
    vx: 0,
    vy: 0,
    angle: 0,
    vAngle: 0,
    fuel: 100,
    score: 0,
    distance: 0,
    gasPressed: false,
    brakePressed: false,
    rotisCollected: 0,
    rotis: [] as { x: number; y: number; collected: boolean }[],
  })

  // Start / Restart Game
  const startGame = () => {
    stateRef.current = {
      playing: true,
      carX: 100,
      carY: 200,
      vx: 0,
      vy: 0,
      angle: 0,
      vAngle: 0,
      fuel: 100,
      score: 0,
      distance: 0,
      gasPressed: false,
      brakePressed: false,
      rotisCollected: 0,
      rotis: Array.from({ length: 60 }, (_, i) => ({
        x: 400 + i * 180 + Math.random() * 60,
        y: 0,
        collected: false,
      })),
    }

    setScore(0)
    setDistance(0)
    setGameState('PLAYING')
  }

  // Keyboard Event Listeners for Gas / Brake / Flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === ' ') {
        stateRef.current.gasPressed = true
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        stateRef.current.brakePressed = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === ' ') {
        stateRef.current.gasPressed = false
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        stateRef.current.brakePressed = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // 60FPS Game Physics & Canvas Render Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    // Procedural Terrain height function
    const getTerrainY = (x: number) => {
      return (
        240 +
        Math.sin(x * 0.008) * 45 +
        Math.cos(x * 0.003) * 35 +
        Math.sin(x * 0.02) * 15
      )
    }

    // Terrain slope slope angle
    const getTerrainSlope = (x: number) => {
      const delta = 2
      const y1 = getTerrainY(x - delta)
      const y2 = getTerrainY(x + delta)
      return Math.atan2(y2 - y1, delta * 2)
    }

    const loop = () => {
      const state = stateRef.current
      if (!state.playing) return

      canvas.width = 800
      canvas.height = 420

      // Physics Constants
      const gravity = 0.38
      const engineAccel = 0.45
      const brakePower = 0.3
      const rotationTorque = 0.045
      const friction = 0.98

      // Apply controls
      if (state.gasPressed && state.fuel > 0) {
        state.vx += Math.cos(state.angle) * engineAccel
        state.vy += Math.sin(state.angle) * engineAccel
        state.vAngle += rotationTorque
        state.fuel = Math.max(0, state.fuel - 0.08)
      } else if (state.brakePressed) {
        state.vx -= Math.cos(state.angle) * brakePower
        state.vAngle -= rotationTorque
        if (state.fuel > 0) state.fuel = Math.max(0, state.fuel - 0.03)
      }

      // Apply Gravity
      state.vy += gravity

      // Apply Velocity
      state.carX += state.vx
      state.carY += state.vy
      state.angle += state.vAngle

      // Air resistance / friction
      state.vx *= friction
      state.vy *= friction
      state.vAngle *= 0.92

      // Terrain Collision Check
      const groundY = getTerrainY(state.carX)
      const groundSlope = getTerrainSlope(state.carX)

      // Car bottom relative position
      const carRadius = 24
      if (state.carY + carRadius >= groundY) {
        state.carY = groundY - carRadius
        state.vy = -state.vy * 0.2 // damp rebound

        // Align car angle gently towards ground slope when on ground
        const angleDiff = groundSlope - state.angle
        state.vAngle += angleDiff * 0.2
        state.vx += Math.sin(groundSlope) * 0.3 // downhill acceleration
      }

      // Check distance & score
      const currentDist = Math.max(0, Math.floor((state.carX - 100) / 10))
      if (currentDist > state.distance) {
        state.distance = currentDist
        state.score += 2
        setDistance(state.distance)
        setScore(state.score)
      }

      // Check collectibles (Roti pickups)
      state.rotis.forEach((roti) => {
        if (!roti.collected) {
          roti.y = getTerrainY(roti.x) - 40
          const distToRoti = Math.hypot(state.carX - roti.x, state.carY - roti.y)
          if (distToRoti < 45) {
            roti.collected = true
            state.score += 100
            state.rotisCollected += 1
            state.fuel = Math.min(100, state.fuel + 25) // Refill fuel on picking rotis!
            setScore(state.score)
          }
        }
      })

      // Check Game Over Conditions
      const normalizedAngle = Math.abs((((state.angle % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
      if (state.carY + carRadius >= groundY && normalizedAngle > Math.PI * 0.65) {
        // Vehicle Flipped Upside Down!
        state.playing = false
        setGameOverReason('Delivery Van Flipped Over!')
        setGameState('GAMEOVER')
        if (state.score > highScore) setHighScore(state.score)
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        return
      }

      if (state.fuel <= 0 && Math.abs(state.vx) < 0.2) {
        // Out of Fuel!
        state.playing = false
        setGameOverReason('Ran Out of Fuel!')
        setGameState('GAMEOVER')
        if (state.score > highScore) setHighScore(state.score)
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        return
      }

      // --- CANVAS RENDERING (Camera follows Car) ---
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cameraX = state.carX - 220

      // Sunset Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      skyGrad.addColorStop(0, '#261911')
      skyGrad.addColorStop(0.6, '#452615')
      skyGrad.addColorStop(1, '#6b361a')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Background Distant Mountain Silhouettes
      ctx.fillStyle = 'rgba(30, 18, 12, 0.6)'
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      for (let x = 0; x <= canvas.width; x += 30) {
        const worldX = cameraX * 0.3 + x
        const mountainY = 220 + Math.sin(worldX * 0.003) * 60 + Math.cos(worldX * 0.001) * 40
        ctx.lineTo(x, mountainY)
      }
      ctx.lineTo(canvas.width, canvas.height)
      ctx.fill()

      // Hilly Ground Surface
      ctx.fillStyle = '#8c431d'
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      for (let screenX = -20; screenX <= canvas.width + 20; screenX += 5) {
        const worldX = cameraX + screenX
        const terrainY = getTerrainY(worldX)
        ctx.lineTo(screenX, terrainY)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.fill()

      // Ground Top Grass / Road Border Line
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 6
      ctx.stroke()

      // Render Floating Roti Pickups along Hills
      state.rotis.forEach((roti) => {
        if (!roti.collected && roti.x > cameraX - 50 && roti.x < cameraX + canvas.width + 50) {
          const screenRotiX = roti.x - cameraX
          ctx.save()
          ctx.translate(screenRotiX, roti.y)
          // Roti glow
          ctx.fillStyle = 'rgba(251, 191, 36, 0.4)'
          ctx.beginPath()
          ctx.arc(0, 0, 18, 0, Math.PI * 2)
          ctx.fill()
          // Roti body
          ctx.fillStyle = '#fde047'
          ctx.beginPath()
          ctx.arc(0, 0, 12, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#d97706'
          ctx.beginPath()
          ctx.arc(-3, -3, 2.5, 0, Math.PI * 2)
          ctx.arc(4, 3, 3, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      // Render Roti Delivery Van
      ctx.save()
      const screenCarX = state.carX - cameraX
      ctx.translate(screenCarX, state.carY)
      ctx.rotate(state.angle)

      // Van Body (Saffron Van)
      ctx.fillStyle = '#ea580c'
      ctx.roundRect(-30, -22, 60, 26, 8)
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Van Roof & Window
      ctx.fillStyle = '#1c1917'
      ctx.fillRect(5, -18, 20, 12)

      // "रोटी" Logo on Van Side
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText('रोटी SEVA', -24, -6)

      // Exhaust Smoke Particles when acceleration active
      if (state.gasPressed) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.beginPath()
        ctx.arc(-36, 2, 4 + Math.random() * 4, 0, Math.PI * 2)
        ctx.arc(-44, 4, 6 + Math.random() * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Animated Spinning Wheels
      const wheelRotation = state.carX * 0.1
      const drawWheel = (wx: number, wy: number) => {
        ctx.save()
        ctx.translate(wx, wy)
        ctx.rotate(wheelRotation)
        ctx.fillStyle = '#1c1917'
        ctx.beginPath()
        ctx.arc(0, 0, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#d6d3d1'
        ctx.beginPath()
        ctx.arc(0, 0, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#78716c'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-9, 0)
        ctx.lineTo(9, 0)
        ctx.stroke()
        ctx.restore()
      }

      drawWheel(-18, 6)
      drawWheel(18, 6)

      ctx.restore()

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationFrameId)
  }, [gameState])

  return (
    <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Badge className="bg-orange-100 text-primary border-orange-200 font-bold">
            <Trophy className="h-3.5 w-3.5 mr-1" /> Hill Climb Racing Seva Edition
          </Badge>
          <h3 className="font-display text-2xl font-bold sm:text-3xl mt-2">Roti Van Hill Climb Challenge</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drive the Roti Delivery Van over the hills of Ahmedabad! Collect fresh rotis for fuel & points!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-semibold">BEST SCORE</p>
            <p className="text-2xl font-bold font-display text-primary">{highScore} pts</p>
          </div>
        </div>
      </div>

      {gameState === 'START' && (
        <div className="text-center py-12 space-y-6 max-w-md mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-primary mx-auto text-4xl shadow-md glow-orange">
            🚚
          </div>
          <div>
            <h4 className="font-display text-2xl font-bold">Ready to Drive the Hills?</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Use <span className="font-bold text-foreground">GAS [Right Arrow / Space]</span> to accelerate & flip forward, and <span className="font-bold text-foreground">BRAKE [Left Arrow]</span> to slow down. Don't flip over or run out of fuel!
            </p>
          </div>
          <Button size="lg" className="w-full text-base font-bold shadow-xl glow-orange" onClick={startGame}>
            <Play className="h-5 w-5 mr-2 fill-current" /> Start Hill Climb Seva Drive
          </Button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="space-y-4">
          {/* HUD Telemetry Bar */}
          <div className="grid grid-cols-3 gap-3 bg-secondary/80 p-4 rounded-2xl border">
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">DISTANCE</p>
              <p className="text-2xl font-bold font-display text-foreground">{distance}m</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">FUEL GAUGE</p>
              <div className="mt-2 h-3 w-full bg-black/20 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stateRef.current.fuel > 30 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${stateRef.current.fuel}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">SCORE</p>
              <p className="text-2xl font-bold font-display text-primary">{score}</p>
            </div>
          </div>

          {/* Interactive Game Canvas */}
          <div className="relative overflow-hidden rounded-2xl border-2 sm:border-4 border-orange-200 shadow-2xl select-none">
            <canvas ref={canvasRef} className="w-full h-[280px] sm:h-[360px] object-cover" />

            {/* Mobile / Touch On-Screen Controls */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 flex justify-between gap-2 pointer-events-auto">
              <button
                onMouseDown={() => (stateRef.current.brakePressed = true)}
                onMouseUp={() => (stateRef.current.brakePressed = false)}
                onTouchStart={() => (stateRef.current.brakePressed = true)}
                onTouchEnd={() => (stateRef.current.brakePressed = false)}
                className="px-3.5 py-2.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-red-600/90 text-white font-bold text-xs sm:text-sm shadow-xl backdrop-blur-md active:scale-95 transition-transform"
              >
                ◀ BRAKE
              </button>

              <button
                onMouseDown={() => (stateRef.current.gasPressed = true)}
                onMouseUp={() => (stateRef.current.gasPressed = false)}
                onTouchStart={() => (stateRef.current.gasPressed = true)}
                onTouchEnd={() => (stateRef.current.gasPressed = false)}
                className="px-4 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-orange-500/90 text-white font-bold text-xs sm:text-sm shadow-xl backdrop-blur-md active:scale-95 transition-transform glow-orange"
              >
                GAS ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="text-center py-10 space-y-6 max-w-md mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 mx-auto text-4xl shadow-inner">
            ⚠️
          </div>
          <div>
            <Badge className="bg-red-100 text-red-700 border-red-200 font-bold">
              <ShieldAlert className="h-3.5 w-3.5 mr-1" /> {gameOverReason}
            </Badge>
            <h4 className="font-display text-3xl font-bold mt-4">Distance Traveled: {distance}m</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Total Score: <span className="font-bold text-foreground">{score} points</span>! You collected{' '}
              <span className="font-bold text-primary">{stateRef.current.rotisCollected} fresh rotis</span> on the drive.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="w-1/2 font-bold" onClick={startGame}>
              <RotateCcw className="h-4 w-4 mr-2" /> Try Again
            </Button>
            <Link to="/donate" className="w-1/2">
              <Button className="w-full font-bold glow-orange">Sponsor Real Rotis</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
