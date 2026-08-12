import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Sparkles, Share2, Check, RefreshCw, Heart } from 'lucide-react'
import { Button, Input, Label, Badge } from './ui'

const STYLES = [
  { id: 'saffron', name: 'Saffron Warmth', bg: 'from-orange-600 via-amber-600 to-amber-700', text: 'text-white' },
  { id: 'charcoal', name: 'Dark Elegance', bg: 'from-[#1e1610] via-[#2d2118] to-[#120d09]', text: 'text-orange-200' },
  { id: 'gold', name: 'Golden Dawn', bg: 'from-amber-400 via-orange-400 to-amber-600', text: 'text-slate-950' },
  { id: 'emerald', name: 'Emerald Seva', bg: 'from-emerald-700 via-teal-800 to-slate-900', text: 'text-emerald-100' },
]

export function BannerGenerator() {
  const [donorName, setDonorName] = useState('Rahul Sharma')
  const [rotiCount, setRotiCount] = useState(100)
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const downloadBanner = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 1200
    canvas.height = 630

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630)
    if (selectedStyle.id === 'saffron') {
      gradient.addColorStop(0, '#ea580c')
      gradient.addColorStop(0.5, '#d97706')
      gradient.addColorStop(1, '#b45309')
    } else if (selectedStyle.id === 'charcoal') {
      gradient.addColorStop(0, '#1e1610')
      gradient.addColorStop(0.5, '#2d2118')
      gradient.addColorStop(1, '#120d09')
    } else if (selectedStyle.id === 'gold') {
      gradient.addColorStop(0, '#fbbf24')
      gradient.addColorStop(0.5, '#f59e0b')
      gradient.addColorStop(1, '#d97706')
    } else {
      gradient.addColorStop(0, '#047857')
      gradient.addColorStop(0.5, '#115e59')
      gradient.addColorStop(1, '#0f172a')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1200, 630)

    // Decorative circle glows
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.beginPath()
    ctx.arc(1000, 100, 300, 0, Math.PI * 2)
    ctx.fill()

    // Brand Logo
    ctx.fillStyle = selectedStyle.id === 'gold' ? '#1c1917' : '#ffffff'
    ctx.font = 'bold 38px sans-serif'
    ctx.fillText('रोटी RotiOnWheels', 80, 100)

    ctx.fillStyle = selectedStyle.id === 'gold' ? 'rgba(28,25,23,0.7)' : 'rgba(255,255,255,0.7)'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('ARHAM YUVA SEVA GROUP · AHMEDABAD', 80, 130)

    // Main Badge Text
    ctx.fillStyle = selectedStyle.id === 'gold' ? '#78350f' : '#fde68a'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('SEVA IMPACT CHAMPION', 80, 240)

    // Dynamic Sponsor Message
    ctx.fillStyle = selectedStyle.id === 'gold' ? '#0f172a' : '#ffffff'
    ctx.font = 'bold 64px serif'
    ctx.fillText(`${donorName || 'A Kind Neighbor'}`, 80, 320)

    ctx.font = 'bold 44px sans-serif'
    ctx.fillStyle = selectedStyle.id === 'gold' ? '#1e293b' : 'rgba(255,255,255,0.9)'
    ctx.fillText(`Sponsored ${rotiCount} Fresh Rotis Today!`, 80, 390)

    // Subtext Quote
    ctx.font = 'italic 24px Georgia'
    ctx.fillStyle = selectedStyle.id === 'gold' ? 'rgba(30,41,59,0.75)' : 'rgba(255,255,255,0.75)'
    ctx.fillText('“A full plate says: you matter.”', 80, 480)

    // Footer info
    ctx.font = '18px sans-serif'
    ctx.fillText('www.rotionwheels.org · 100% Volunteer Driven Seva', 80, 560)

    // Download trigger
    const link = document.createElement('a')
    link.download = `RotiOnWheels-Impact-${donorName.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <Badge className="bg-orange-100 text-primary border-orange-200">
            <Sparkles className="h-3 w-3 mr-1" /> Social Banner Studio
          </Badge>
          <h3 className="font-display text-2xl font-bold sm:text-3xl mt-2">Generate Your Seva Impact Badge</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Share your warmth on Instagram, WhatsApp, or LinkedIn to inspire friends & family!
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={copyShareLink}>
          {copied ? <Check className="h-4 w-4 mr-1 text-emerald-600" /> : <Share2 className="h-4 w-4 mr-1" />}
          {copied ? 'Link Copied!' : 'Share Campaign'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
        {/* Controls */}
        <div className="space-y-5 bg-secondary/40 p-6 rounded-2xl border">
          <div>
            <Label htmlFor="bannerName">Your Name</Label>
            <Input
              id="bannerName"
              className="mt-2 bg-white"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Rahul Sharma"
            />
          </div>

          <div>
            <Label htmlFor="bannerRotis">Rotis Sponsored</Label>
            <Input
              id="bannerRotis"
              type="number"
              min="10"
              step="10"
              className="mt-2 bg-white"
              value={rotiCount}
              onChange={(e) => setRotiCount(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Visual Theme</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                    selectedStyle.id === style.id
                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                      : 'bg-white hover:border-muted-foreground/40'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full mt-4 h-11 sm:h-12 px-3 sm:px-4 text-[11px] sm:text-sm font-bold shadow-lg glow-orange whitespace-nowrap flex items-center justify-center" onClick={downloadBanner}>
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" /> Download High-Res Badge (PNG)
          </Button>
        </div>

        {/* Live Banner Preview */}
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Live Banner Preview</p>
          <div
            className={`relative aspect-[1200/630] w-full rounded-2xl bg-gradient-to-br ${selectedStyle.bg} ${selectedStyle.text} p-4 sm:p-8 lg:p-10 shadow-2xl flex flex-col justify-between overflow-hidden border border-white/20`}
          >
            {/* Background ambient decorative shapes */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white text-orange-600 font-bold text-[11px] sm:text-sm shadow shrink-0">
                    रोटी
                  </span>
                  <div className="min-w-0 truncate">
                    <span className="font-bold tracking-tight text-xs sm:text-lg block truncate">RotiOnWheels</span>
                    <p className="text-[8px] sm:text-[10px] opacity-75 font-medium tracking-widest uppercase truncate">Arham Yuva Seva Group</p>
                  </div>
                </div>
                <Badge className="border-white/30 bg-white/20 backdrop-blur-sm text-current text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-1 shrink-0 whitespace-nowrap">
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 fill-current inline-block" /> 100% Volunteer Seva
                </Badge>
              </div>

              <div className="mt-2.5 sm:mt-8 space-y-0.5 sm:space-y-2">
                <p className="text-[8px] sm:text-xs font-bold tracking-widest uppercase opacity-80">SEVA IMPACT CHAMPION</p>
                <h4 className="font-display text-base sm:text-3xl md:text-5xl font-bold tracking-tight truncate leading-tight">
                  {donorName || 'A Kind Neighbor'}
                </h4>
                <p className="text-[11px] sm:text-lg md:text-2xl font-semibold opacity-95 leading-tight">
                  Sponsored <span className="underline decoration-wavy underline-offset-4">{rotiCount} Fresh Rotis</span> Today!
                </p>
              </div>
            </div>

            <div className="pt-2 sm:pt-6 border-t border-white/15 flex flex-row items-center justify-between gap-2 text-[8px] sm:text-xs opacity-80">
              <p className="italic truncate">“A full plate says: you matter.”</p>
              <p className="font-semibold shrink-0">rotionwheels.org</p>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  )
}
