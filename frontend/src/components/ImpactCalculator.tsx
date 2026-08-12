import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Heart, ShieldCheck, Flame, Users } from 'lucide-react'
import { Button, Badge, Card, CardContent } from './ui'
import { Link } from 'react-router-dom'

export function ImpactCalculator() {
  const [amount, setAmount] = useState(1000)

  const rotis = Math.floor(amount / 10)
  const familiesFed = Math.floor(rotis / 8) // ~8 rotis per family meal
  const calories = rotis * 120 // ~120 kcal per whole wheat roti with ghee
  const taxSavings = Math.floor(amount * 0.5) // ~50% tax deduction under 80G

  return (
    <div className="rounded-3xl border bg-gradient-to-br from-orange-950 via-[#231b15] to-[#17110c] text-white p-6 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Decorative ambient background blur circles */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <Badge className="bg-white/10 text-orange-300 border-white/20 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-orange-400" /> Dynamic Impact Estimator
          </Badge>
          <h3 className="font-display text-3xl sm:text-5xl font-bold mt-4">See Your Generosity in Action</h3>
          <p className="text-sm text-white/70 mt-2 max-w-xl">
            Slide to customize your sponsorship amount and see the exact real-world nourishment delivered to neighbors in need.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/15 text-center">
          <p className="text-xs uppercase tracking-widest text-orange-300 font-bold">Estimated 80G Tax Saving</p>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-1">₹{taxSavings.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-center">
        {/* Interactive Slider & Metrics */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-white/80">Select Sponsorship Amount</span>
              <span className="font-display text-4xl font-bold text-orange-400">₹{amount.toLocaleString('en-IN')}</span>
            </div>

            <input
              type="range"
              min="200"
              max="25000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
            />
            <div className="flex justify-between text-xs text-white/50 mt-2 font-medium">
              <span>₹200 (20 rotis)</span>
              <span>₹5,000 (500 rotis)</span>
              <span>₹25,000 (2,500 rotis)</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-3">
            {[500, 1000, 2500, 5000, 10000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  amount === preset
                    ? 'bg-orange-500 text-white border-orange-400 shadow-lg glow-orange'
                    : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
              <Heart className="h-5 w-5 text-orange-400 mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-orange-300">{rotis.toLocaleString('en-IN')}</p>
              <p className="text-xs text-white/60 mt-0.5">Nutritious Rotis</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
              <Users className="h-5 w-5 text-amber-400 mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-amber-300">{familiesFed.toLocaleString('en-IN')}</p>
              <p className="text-xs text-white/60 mt-0.5">Families Nourished</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
              <Flame className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-emerald-300">{(calories / 1000).toFixed(1)}k</p>
              <p className="text-xs text-white/60 mt-0.5">Energy (Kcal)</p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 space-y-6 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Your Sponsorship</p>
            <p className="font-display text-4xl font-bold text-white mt-2">₹{amount.toLocaleString('en-IN')}</p>
            <p className="text-sm text-white/70 mt-1">Direct nourishment for {rotis} neighbors.</p>
          </div>

          <div className="space-y-2 text-xs text-white/80 text-left bg-black/20 p-4 rounded-2xl">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> Instant 80G Tax Exemption Certificate
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" /> 100% Transparency Guarantee
            </p>
          </div>

          <Link to="/donate" state={{ initialAmount: amount }}>
            <Button size="lg" className="w-full text-base font-bold shadow-xl glow-orange">
              Sponsor Now <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
