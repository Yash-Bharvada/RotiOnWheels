import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MapPin, Sparkles } from 'lucide-react'

interface GalleryItem {
  id: number
  imageUrl: string
  title: string
  thought: string
  location: string
  tag: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    title: 'Dignity in Every Plate',
    thought: 'A warm meal is not just food; it is a reminder that you are loved, respected, and remembered by your community.',
    location: 'Drive 1 · Satellite District',
    tag: 'Daily Seva'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop',
    title: 'Love Baked in Every Roti',
    thought: 'Every morning before sunrise, our kitchen fills with warmth, flour, and the devotion of selfless volunteers.',
    location: 'Central Kitchen · Ahmedabad',
    tag: 'Kitchen Hygiene'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    title: 'Seva On Wheels',
    thought: 'Hunger cannot wait for tomorrow. Our vans reach every corner so no neighbor sleeps on an empty stomach.',
    location: 'Mobile Van · Relief Road',
    tag: 'Distribution'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=1200&auto=format&fit=crop',
    title: 'The Gift of Togetherness',
    thought: 'Sharing a meal creates a circle of trust where every individual feels respected, heard, and nourished.',
    location: 'Ashram Road Circle',
    tag: 'Community Care'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200&auto=format&fit=crop',
    title: 'Nourishing Young Dreams',
    thought: 'When children receive nutritious rotis today, they build the strength, energy, and hope to dream for tomorrow.',
    location: 'Kalupur School Seva',
    tag: 'Child Nutrition'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop',
    title: 'Hands That Serve',
    thought: 'Over 120 young volunteers step up every single day to turn small acts of kindness into 3,000 warm meals.',
    location: 'Arham Yuva Volunteer Corps',
    tag: 'Youth Volunteerism'
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1200&auto=format&fit=crop',
    title: '365 Days of Unbroken Seva',
    thought: 'Rain or shine, heat or storm — our commitment to feeding our city never pauses for a single day.',
    location: 'Annual Seva Milestone',
    tag: 'Unbroken Promise'
  }
]

export function SevaGalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // 5-Second Automatic Autoplay — Resets full 5s timer whenever landing on a slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % GALLERY_ITEMS.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % GALLERY_ITEMS.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)
  }

  const item = GALLERY_ITEMS[currentIndex]

  return (
    <section id="gallery" className="scroll-mt-20 bg-[#1e1713] py-10 sm:py-14 text-white overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-0.5 text-[11px] font-bold text-orange-400 backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> Moments of Compassion
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Seva Through The Lens
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-white/70 max-w-xl">
            Real stories of warmth, dignity, and community care captured across our daily food drives.
          </p>
        </div>

        {/* Carousel Frame - Clean 5-Second Automatic Carousel */}
        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl bg-black/40">

          {/* Invisible Left & Right Click / Tap Zones */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute top-0 left-0 bottom-0 w-1/2 z-20 cursor-pointer focus:outline-none select-none bg-transparent"
          />
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute top-0 right-0 bottom-0 w-1/2 z-20 cursor-pointer focus:outline-none select-none bg-transparent"
          />

          {/* Photo Slide Display - 360px on mobile (untouched), 480px on tablet, 580px on desktop */}
          <div className="relative h-[360px] sm:h-[480px] lg:h-[580px] w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle dark gradient overlay at top for contrast */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-orange-600/90 text-white font-bold text-[10px] sm:text-xs px-3 py-1 shadow-lg backdrop-blur-md flex items-center gap-1.5">
                    <Heart className="h-3 w-3 fill-current text-amber-200" /> {item.tag}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-black/50 text-white/80 text-xs px-3 py-1 backdrop-blur-md border border-white/10 font-medium">
                    <MapPin className="h-3 w-3 text-orange-400" /> {item.location}
                  </span>
                </div>

                {/* ── FLOATING GLASSMORPHISM THOUGHT CARD ── */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 z-10 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="rounded-xl sm:rounded-2xl border border-white/20 bg-black/60 backdrop-blur-xl p-4 sm:p-6 lg:p-7 shadow-2xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      <span>{item.title}</span>
                      <span className="text-[10px] text-white/70 font-normal">
                        {currentIndex + 1} / {GALLERY_ITEMS.length}
                      </span>
                    </div>

                    <p className="font-display text-sm sm:text-xl lg:text-2xl font-bold text-white leading-snug sm:leading-tight">
                      “{item.thought}”
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] sm:text-sm text-white/70 font-medium">
                        {item.location}
                      </p>

                      {/* Integrated Mobile & Desktop Indicators */}
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 z-30 pointer-events-auto">
                        {GALLERY_ITEMS.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentIndex(idx)
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              currentIndex === idx
                                ? 'w-5 bg-orange-500'
                                : 'w-1.5 bg-white/40 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  )
}
