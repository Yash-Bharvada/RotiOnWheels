import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ShieldCheck, Heart, PieChart, Truck, Sparkles, Award, CheckCircle2 } from 'lucide-react'
import { Badge, Button } from './ui'

interface SlideProps {
  onClose: () => void
}

const slides = [
  {
    id: 1,
    category: 'EXECUTIVE SUMMARY',
    title: 'The Daily Promise of Dignity',
    subtitle: 'RotiOnWheels Impact Strategy & Seva Overview',
    icon: Sparkles,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-5 text-center">
            <p className="text-3xl font-bold font-display text-primary">3,000+</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Fresh Rotis Cooked Daily</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 text-center">
            <p className="text-3xl font-bold font-display text-amber-700">365 Days</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Unbroken Seva Calendar</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-center">
            <p className="text-3xl font-bold font-display text-emerald-700">100%</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1">Volunteer Managed</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Arham Yuva Seva Group mobilizes youth across Ahmedabad to ensure no elderly, daily-wage laborer, or underprivileged family sleeps hungry. Every roti is hand-rolled with love, packed in thermal cases, and delivered hot.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    category: 'KITCHEN HYGIENE & QUALITY',
    title: 'Sanitation & Sourcing Standards',
    subtitle: 'High quality ingredients meets traditional warmth',
    icon: ShieldCheck,
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" /> 100% Whole Wheat Flour
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sourced directly from local farmers with zero maida or preservatives added.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" /> Thermal Insulation Transport
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rotis are kept at 65°C in food-grade thermal containers for minimum heat loss.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" /> Medical Gloves & Hairnets
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            120+ volunteers follow strict WHO hygiene standards in our central kitchen.
          </p>
        </div>
        <div className="space-y-3 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <CheckCircle2 className="h-4 w-4" /> FSSAI Certified Kitchen
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Regular audits, water filtration testing, and sanitary surface protocols.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    category: 'FINANCIAL TRANSPARENCY',
    title: 'Where Every Rupee Goes',
    subtitle: 'Maximized impact through direct volunteer operations',
    icon: PieChart,
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Raw Ingredients (Atta, Ghee, Fuel)</span>
            <span className="text-primary">78%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[78%]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Van Maintenance & Fuel Logistics</span>
            <span className="text-amber-600">15%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[15%]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Eco Packaging & Thermal Boxes</span>
            <span className="text-emerald-600">7%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[7%]" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          * 0% spent on administrative overheads. All leadership and distribution is 100% voluntary.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    category: 'EXPANSION ROADMAP 2026',
    title: 'Scaling from 3,000 to 10,000 Rotis Daily',
    subtitle: 'Connecting more neighborhoods across Gujarat',
    icon: Truck,
    content: (
      <div className="space-y-4">
        <div className="border-l-2 border-primary pl-4 py-1 space-y-1">
          <p className="text-xs font-bold text-primary">PHASE 1 (COMPLETED)</p>
          <p className="text-sm font-semibold">Ahmedabad West Corridor</p>
          <p className="text-xs text-muted-foreground">Navrangpura, Satellite, SG Highway shelter points.</p>
        </div>
        <div className="border-l-2 border-amber-400 pl-4 py-1 space-y-1">
          <p className="text-xs font-bold text-amber-600">PHASE 2 (IN PROGRESS)</p>
          <p className="text-sm font-semibold">Adding 2 Mobile Van Kitchens</p>
          <p className="text-xs text-muted-foreground">Expanding to Kalupur Railway Station and Naroda industrial hub.</p>
        </div>
        <div className="border-l-2 border-emerald-500 pl-4 py-1 space-y-1">
          <p className="text-xs font-bold text-emerald-600">PHASE 3 (TARGET 2027)</p>
          <p className="text-sm font-semibold">Inter-city Seva Network</p>
          <p className="text-xs text-muted-foreground">Replicating RotiOnWheels model in Vadodara & Surat.</p>
        </div>
      </div>
    ),
  },
]

export function ImpactDeckModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!isOpen) return null

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-xs">
              रोटी
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{slide.category}</p>
              <p className="text-xs text-muted-foreground">Slide {currentSlide + 1} of {slides.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-black/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Slide Content */}
        <div className="p-5 sm:p-10 flex-1 overflow-y-auto flex flex-col justify-between max-h-[calc(90vh-100px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 sm:space-y-6"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-primary">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-3xl font-bold text-foreground leading-tight">{slide.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{slide.subtitle}</p>
                </div>
              </div>

              {slide.content}
            </motion.div>
          </AnimatePresence>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-5 sm:pt-6 border-t mt-6 gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-6 sm:w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="px-2.5 sm:px-3 text-xs"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide((prev) => prev - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0.5 sm:mr-1" /> Prev
              </Button>
              {currentSlide < slides.length - 1 ? (
                <Button
                  size="sm"
                  className="px-3 sm:px-4 text-xs"
                  onClick={() => setCurrentSlide((prev) => prev + 1)}
                >
                  Next <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-0.5 sm:ml-1" />
                </Button>
              ) : (
                <Button size="sm" className="px-3 sm:px-4 text-xs font-bold" onClick={onClose}>
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
