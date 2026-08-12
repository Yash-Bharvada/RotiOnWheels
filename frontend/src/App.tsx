import { useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import * as L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleCheck,
  HeartHandshake,
  Instagram,
  Landmark,
  Mail,
  Menu,
  Navigation,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  X,
  FileText,
  Gamepad2,
  Share2,
  Award,
  Heart,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react'

import {
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  AccordionItem
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

import { RollingCounter, AnimatedProgress } from '@/components/RollingCounter'
import { ThreeHeroCanvas } from '@/components/ThreeHeroCanvas'
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, FloatingCard } from '@/components/FramerComponents'
import { ImpactDeckModal } from '@/components/ImpactDeckModal'
import { BannerGenerator } from '@/components/BannerGenerator'
import { RotiGame } from '@/components/RotiGame'
import { ImpactCalculator } from '@/components/ImpactCalculator'
import { UpiPaymentModal } from '@/components/UpiPaymentModal'
import { AuthPage } from '@/pages/Auth'

const heroImage = '/roti-community-hero.webp'
const kitchenImage = '/roti-kitchen.webp'

function Header({ onOpenDeck }: { onOpenDeck: () => void }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const links = [
    ['About', '/#about'],
    ['Impact', '/#impact'],
    ['Live Tracking', '/#tracking'],
    ['Calculator', '/#calculator'],
    ['Seva Game', '/#game'],
    ['Social Badge', '/#banner'],
    ['FAQs', '/#faqs']
  ]

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-md transition-transform group-hover:scale-105 glow-orange">
            रोटी
          </span>
          <div>
            <span className="block text-lg font-bold tracking-tight">
              Roti<span className="text-primary">On</span>Wheels
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground sm:block">
              Arham Yuva Seva Group
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {label}
            </a>
          ))}
          <button
            onClick={onOpenDeck}
            className="flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-bold text-secondary-foreground transition-all hover:bg-primary hover:text-white"
          >
            <FileText className="h-3.5 w-3.5" /> 2026 Deck
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-amber-100/80 text-amber-900 px-3 py-1.5 rounded-full border border-amber-200">
                <User className="h-3.5 w-3.5 text-primary" />
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-xs text-muted-foreground hover:text-destructive gap-1 px-2.5"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-xs font-semibold rounded-full px-4 border-amber-200 hover:bg-amber-50">
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/donate">
            <Button size="sm" className="shadow-md glow-orange font-bold">
              Donate now <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>

          <button
            className="rounded-full p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-background px-6 py-5 lg:hidden space-y-3"
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block border-b py-2.5 text-sm font-semibold text-foreground hover:text-primary last:border-0"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false)
                onOpenDeck()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-100 py-3 text-xs font-bold text-primary"
            >
              <FileText className="h-4 w-4" /> Open 2026 Impact Pitch Deck
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-[#1e1610] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold shadow-md">
              रोटी
            </span>
            <span className="text-xl font-bold font-display tracking-wide">RotiOnWheels</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
            A daily act of dignity, warmth, and a full plate for every neighbor in need. 100% volunteer-run, sustained by community kindness.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-white/15 p-2.5 text-white/70 hover:bg-white/10 hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="rounded-full border border-white/15 p-2.5 text-white/70 hover:bg-white/10 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-primary">Our Promise</p>
          <div className="space-y-3.5 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> 80G Tax Exemption Certificate
            </p>
            <p className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 shrink-0 text-primary" /> 100% Direct Volunteer Seva
            </p>
            <p className="flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 shrink-0 text-primary" /> Transparent Community Care
            </p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-primary">Reach Us</p>
          <div className="space-y-4 text-sm text-white/70">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> hello@rotionwheels.org
            </p>
            <p className="flex items-start gap-2">
              <Landmark className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>
                Arham Yuva Seva Group
                <br />
                Ahmedabad, Gujarat, India
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 py-6 text-xs text-white/40 sm:flex-row sm:justify-between lg:px-8">
        <span>© 2026 RotiOnWheels. An Arham Yuva Seva Group initiative.</span>
        <span>Built with care · Served with love</span>
      </div>
    </footer>
  )
}

const truckRoute: [number, number][] = [
  [23.0307, 72.5180],
  [23.0340, 72.5250],
  [23.0380, 72.5340],
  [23.0440, 72.5410],
  [23.0490, 72.5490],
  [23.0550, 72.5560],
  [23.0610, 72.5620],
  [23.0570, 72.5510],
  [23.0480, 72.5390],
  [23.0400, 72.5280],
  [23.0330, 72.5200]
]

const createNavigationVehicleIcon = (headingAngle: number) =>
  L.divIcon({
    className: '',
    html: `<div style="transform: rotate(${Math.round(headingAngle)}deg);" class="relative flex items-center justify-center transition-transform duration-100 ease-out"><div class="absolute -top-8 h-16 w-16 rounded-full bg-gradient-to-t from-orange-500/40 via-amber-300/20 to-transparent blur-[3px]"></div><div class="absolute -inset-3 animate-ping rounded-full bg-orange-500/25"></div><img src="/truck-topdown.svg" class="relative h-16 w-10 drop-shadow-2xl select-none pointer-events-none" alt="Roti Delivery Van" /></div>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32]
  })

function SmoothVanMarker({ waypoints }: { waypoints: [number, number][] }) {
  const [position, setPosition] = useState<[number, number]>(waypoints[0])
  const [heading, setHeading] = useState<number>(45)
  const map = useMap()

  useEffect(() => {
    if (waypoints.length < 2) return

    let currentIdx = 0
    let startTime = performance.now()
    const DURATION = 3200

    let animationId: number

    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / DURATION, 1)
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const start = waypoints[currentIdx]
      const nextIdx = (currentIdx + 1) % waypoints.length
      const end = waypoints[nextIdx]

      const lat = start[0] + (end[0] - start[0]) * ease
      const lng = start[1] + (end[1] - start[1]) * ease
      const currentPos: [number, number] = [lat, lng]

      const dLat = end[0] - start[0]
      const dLng = end[1] - start[1]
      const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI

      setPosition(currentPos)
      setHeading(angle)
      map.panTo(currentPos, { animate: true, duration: 0.1 })

      if (progress >= 1) {
        currentIdx = nextIdx
        startTime = time
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [map, waypoints])

  const icon = useMemo(() => createNavigationVehicleIcon(heading), [heading])

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className="font-sans text-xs">
          <p className="font-bold text-primary">Roti Delivery Van #1</p>
          <p className="text-muted-foreground">Active Distribution Route</p>
        </div>
      </Popup>
    </Marker>
  )
}

function MapRecenter() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    if (!container) return
    const invalidate = () => map.invalidateSize()
    invalidate()
    const timer1 = setTimeout(invalidate, 100)
    const timer2 = setTimeout(invalidate, 400)
    const observer = new ResizeObserver(invalidate)
    observer.observe(container)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      observer.disconnect()
    }
  }, [map])
  return null
}

function TrackingWidget() {
  return (
    <section id="tracking" className="scroll-mt-20 bg-[#f4eadc]/60 py-24 border-y">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <FadeIn className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Badge className="border-orange-200 bg-white text-primary font-bold shadow-sm">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE NOW
            </Badge>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Follow the Warmth Through the City
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Live GPS telemetry of our food delivery van. Volunteers are currently sharing fresh rotis across Ahmedabad.
          </p>
        </FadeIn>

        <ScaleIn className="grid grid-cols-1 overflow-hidden rounded-3xl border bg-white shadow-2xl lg:grid-cols-[1fr_360px]">
          <div className="relative min-h-[440px] min-w-0 w-full">
            <MapContainer
              center={truckRoute[0]}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: '440px', width: '100%' }}
              className="h-[440px] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              <SmoothVanMarker waypoints={truckRoute} />
              <MapRecenter />
            </MapContainer>

            <div className="absolute left-5 top-5 z-[1000] flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold shadow-lg border">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" /> Live GPS Navigation Active
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-between p-6 sm:p-8 bg-card">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Roti Delivery Van #1</p>
              <p className="mt-2 text-2xl font-bold tracking-tight">Active Route Location</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cruising through Navrangpura & Ashram Road, distributing warm meals cooked at dawn.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between border-b pb-3 text-sm">
                  <span className="text-muted-foreground">Current Area</span>
                  <span className="font-semibold text-foreground">Navrangpura & Ashram Road</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3 text-sm">
                  <span className="text-muted-foreground">Meals Remaining</span>
                  <span className="font-bold text-primary">180+ Rotis</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Distribution
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-secondary p-4 border">
              <div className="flex items-center gap-3">
                <Navigation className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Live GPS Telemetry</p>
                  <p className="font-bold text-xs text-foreground">60fps Smooth Motion Interpolation</p>
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </section>
  )
}

function Home() {
  const [deckOpen, setDeckOpen] = useState(false)

  return (
    <>
      <Header onOpenDeck={() => setDeckOpen(true)} />
      <main>
        {/* HERO SECTION WITH THREE.JS 3D WARMTH CANVAS & FRAMER MOTION */}
        <section className="relative min-h-[700px] overflow-hidden bg-[#261d17] text-white flex items-center">
          {/* Three.js 3D Glowing Particles Background */}
          <ThreeHeroCanvas />

          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Volunteers distributing fresh rotis"
              className="h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#211914] via-[#211914]/85 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 lg:px-8 w-full">
            <StaggerContainer className="max-w-2xl space-y-8">
              <StaggerItem>
                <Badge className="border-orange-400/30 bg-orange-500/20 text-orange-200 backdrop-blur-md px-4 py-1.5 text-xs font-bold shadow-lg">
                  <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-300" /> A Daily Act of Care · 80G Tax Exempt
                </Badge>
              </StaggerItem>

              <StaggerItem>
                <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
                  Feeding <span className="gradient-text-saffron">3,000 Lives</span> Daily.
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="text-lg leading-relaxed text-white/80 max-w-xl">
                  Every morning, our volunteers turn flour, fire, and faith into fresh, wholesome rotis for neighbors who need a little extra warmth and dignity.
                </p>
              </StaggerItem>

              <StaggerItem className="flex flex-col gap-4 sm:flex-row pt-2">
                <Link to="/donate">
                  <Button size="lg" className="shadow-xl glow-orange font-bold text-base w-full sm:w-auto">
                    Donate Meals Now <ArrowRight className="h-5 w-5 ml-1" />
                  </Button>
                </Link>
                <a href="#tracking">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md w-full sm:w-auto"
                  >
                    Track Live Van <Play className="h-4 w-4 ml-1 fill-current text-orange-300" />
                  </Button>
                </a>
              </StaggerItem>

              <StaggerItem>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-white/40">
                  An Initiative by Arham Yuva Seva Group
                </p>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* ROLLING COUNTER IMPACT BAR */}
        <section id="impact" className="scroll-mt-20 border-b bg-primary py-14 text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:grid-cols-3 lg:px-8">
            {[
              ['3,000+', 'Rotis Cooked & Served Daily', 100],
              ['365', 'Unbroken Days Active Each Year', 100],
              ['100%', 'Volunteer Run & transparent', 100]
            ].map(([value, label, progress]) => (
              <FadeIn key={label} className="border-white/20 sm:border-l sm:pl-8 first:border-0 first:pl-0">
                <p className="font-display text-4xl font-bold sm:text-5xl">
                  <RollingCounter value={value as string} />
                </p>
                <p className="mt-1 text-sm font-medium text-white/80">{label}</p>
                <AnimatedProgress value={progress as number} className="mt-4 bg-white/20 [&>div]:bg-white" />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* LIVE MAP TRACKING WIDGET */}
        <TrackingWidget />

        {/* IMPACT CALCULATOR */}
        <section id="calculator" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <ImpactCalculator />
        </section>

        {/* ABOUT & KITCHEN HYGIENE */}
        <section id="about" className="scroll-mt-20 mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-2 lg:items-center lg:px-8">
          <FloatingCard className="relative">
            <img
              src={kitchenImage}
              alt="Volunteers making fresh rotis"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl border"
            />
            <div className="absolute -bottom-6 -right-3 max-w-[240px] rounded-2xl bg-white p-6 shadow-2xl sm:-right-6 border border-orange-100">
              <p className="font-display text-xl font-bold text-primary">“A full plate says: you matter.”</p>
              <p className="mt-2 text-xs text-muted-foreground font-semibold">— Volunteer Core Promise</p>
            </div>
          </FloatingCard>

          <FadeIn className="lg:pl-8 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Who We Are</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
                Good food is a beginning, not a luxury.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              RotiOnWheels is a daily food distribution initiative by Arham Yuva Seva Group. We believe hunger should never decide someone’s tomorrow, so we show up every day with fresh, wholesome rotis made with care.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              From our clean central kitchen to the streets of Ahmedabad, every roti is a small reminder that our neighborhoods look after one another.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <div className="flex -space-x-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-background bg-orange-200 text-sm font-bold shadow">
                  ☺
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-background bg-amber-300 text-sm font-bold shadow">
                  ♥
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-background bg-orange-500 text-sm font-bold text-white shadow">
                  +
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Join 120+ Everyday Volunteers</p>
                <p className="text-xs text-muted-foreground">Cooking, packing & driving across Ahmedabad</p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* SEVA MINI GAME CHALLENGE */}
        <section id="game" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <RotiGame />
        </section>

        {/* SOCIAL BANNER GENERATOR */}
        <section id="banner" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <BannerGenerator />
        </section>

        {/* FAQS SECTION */}
        <section id="faqs" className="scroll-mt-20 mx-auto max-w-4xl px-5 py-24 lg:px-8">
          <FadeIn className="text-center mb-12">
            <Badge className="bg-orange-100 text-primary border-orange-200">
              <HelpCircle className="h-3.5 w-3.5 mr-1" /> Transparent Answers
            </Badge>
            <h2 className="font-display text-4xl font-bold mt-4">Frequently Asked Questions</h2>
          </FadeIn>

          <div className="bg-card rounded-3xl border p-6 sm:p-10 shadow-lg divide-y">
            <AccordionItem title="Is my donation eligible for 80G Tax Exemption?">
              Yes! RotiOnWheels is an initiative of Arham Yuva Seva Group, a registered non-profit organization. All donations automatically generate a provisional 80G receipt with official tax certificate processing.
            </AccordionItem>
            <AccordionItem title="How much does one roti cost to prepare & distribute?">
              It costs approximately ₹10 to source high-grade whole wheat flour, cook with pure ghee in our sanitary kitchen, pack in thermal boxes, and distribute via our van network.
            </AccordionItem>
            <AccordionItem title="Can I volunteer in the central kitchen or delivery van?">
              Absolutely! We welcome volunteers every morning from 5:30 AM to 9:00 AM for dough rolling, tava cooking, and packing. Contact us or drop by our Ahmedabad kitchen.
            </AccordionItem>
            <AccordionItem title="How is hygiene maintained during preparation?">
              Our central kitchen is FSSAI compliant. All volunteers wear medical gloves, aprons, and hairnets. Meals are packed in hot thermal cases to ensure warm delivery at 65°C.
            </AccordionItem>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="mx-auto mb-24 max-w-7xl px-5 lg:px-8">
          <ScaleIn className="rounded-3xl bg-[#261d17] p-8 text-white sm:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center relative z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-300">
                  One Meal. One Neighbor. One Brighter Day.
                </p>
                <h2 className="mt-3 max-w-xl font-display text-3xl font-bold sm:text-5xl">
                  Help Us Keep the Wheels Turning.
                </h2>
              </div>
              <Link to="/donate">
                <Button size="lg" className="shadow-xl glow-orange font-bold text-base">
                  Sponsor Meals Now <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </ScaleIn>
        </section>
      </main>

      <Footer />

      {/* Impact Presentation Slide Deck Modal */}
      <ImpactDeckModal isOpen={deckOpen} onClose={() => setDeckOpen(false)} />
    </>
  )
}

const donationTiers = [
  { amount: 500, rotis: 50 },
  { amount: 1000, rotis: 100 },
  { amount: 2500, rotis: 250 },
  { amount: 5000, rotis: 500 }
]

type Donor = { name: string; email: string; mobile: string; pan: string; amount: number }

function Receipt({ donor, reference }: { donor: Donor; reference: string }) {
  return (
    <div className="print-receipt rounded-3xl border-2 border-primary/30 bg-white p-6 text-foreground sm:p-10 shadow-lg">
      <div className="flex items-start justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white shadow-md">
            रोटी
          </span>
          <div>
            <p className="font-bold text-lg font-display">RotiOnWheels</p>
            <p className="text-xs text-muted-foreground font-semibold">Arham Yuva Seva Group · Ahmedabad</p>
          </div>
        </div>
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold">Provisional 80G</Badge>
      </div>

      <div className="py-8 text-center">
        <CircleCheck className="mx-auto h-14 w-14 text-emerald-500" />
        <h3 className="mt-4 font-display text-3xl font-bold">Donation Certificate</h3>
        <p className="mt-2 text-sm text-muted-foreground">Thank you for keeping a neighbor fed with dignity.</p>
      </div>

      <div className="grid gap-4 border-y py-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Donor Name</p>
          <p className="mt-1 font-semibold text-foreground">{donor.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Date</p>
          <p className="mt-1 font-semibold text-foreground">{new Date().toLocaleDateString('en-IN')}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">PAN Number</p>
          <p className="mt-1 font-semibold text-foreground">{donor.pan}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Reference</p>
          <p className="mt-1 font-semibold text-foreground">{reference}</p>
        </div>
      </div>

      <div className="py-6 text-center bg-orange-50/50 rounded-2xl my-4">
        <p className="text-xs uppercase tracking-[.18em] text-muted-foreground font-bold">Contribution Received</p>
        <p className="mt-2 font-display text-4xl font-bold text-primary">₹{donor.amount.toLocaleString('en-IN')}</p>
        <p className="mt-2 text-sm font-medium text-foreground">Equivalent to {Math.floor(donor.amount / 10)} nutritious rotis</p>
      </div>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        This is an official provisional receipt. An 80G tax exemption certificate will be emailed to {donor.email}.
      </p>
    </div>
  )
}

function Donation() {
  const location = useLocation()
  const initialAmt = (location.state as any)?.initialAmount || 1000

  const [donor, setDonor] = useState<Donor>({
    name: '',
    email: '',
    mobile: '',
    pan: '',
    amount: initialAmt
  })
  const [gateway, setGateway] = useState(false)
  const [success, setSuccess] = useState(false)
  const [receipt, setReceipt] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const navigate = useNavigate()

  const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(donor.pan)
  const selectedTier = donationTiers.find((tier) => tier.amount === donor.amount)
  const rotis = selectedTier?.rotis ?? Math.floor(donor.amount / 10)

  const update = (key: keyof Donor, value: string | number) =>
    setDonor((current) => ({ ...current, [key]: value }))

  const proceed = (event: React.FormEvent) => {
    event.preventDefault()
    if (!donor.name || !donor.email || !donor.mobile || !panValid || donor.amount < 100) {
      setError(!panValid ? 'Please enter a valid PAN card number (e.g. ABCDE1234F).' : 'Please complete all donor details and choose at least ₹100.')
      return
    }
    setError('')
    setGateway(true)
  }

  const completePayment = async () => {
    const { error: donationError } = await supabase.from('roti_donations').insert({
      full_name: donor.name,
      email: donor.email,
      mobile: donor.mobile,
      pan_number: donor.pan,
      amount: donor.amount,
      rotis_sponsored: rotis,
      payment_status: 'success'
    })

    if (donationError) {
      setSaveError(
        'Your payment was recorded, but receipt sync is delayed. Please keep this reference for your records.'
      )
    }
    setGateway(false)
    setSuccess(true)
  }

  const reference = `ROW${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 899999)}`

  return (
    <>
      <Header onOpenDeck={() => {}} />
      <main className="bg-[#f7f0e7] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Badge className="border-orange-200 bg-orange-50 text-primary font-bold">
              Give a Meal · Give a Moment
            </Badge>
            <h1 className="mt-5 font-display text-5xl font-bold tracking-tight sm:text-6xl">
              Your Kindness Travels Far.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Choose an amount that feels right. We turn every ₹10 into fresh rotis and issue an 80G tax receipt.
            </p>
          </FadeIn>

          {!success ? (
            <form onSubmit={proceed} className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.25fr_.75fr]">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-display text-2xl font-bold">Donor Information</CardTitle>
                  <CardDescription>Details required for issuing your 80G Tax Exemption Certificate.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      className="mt-2"
                      placeholder="Rahul Sharma"
                      value={donor.name}
                      onChange={(e) => update('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-2"
                      placeholder="rahul@example.com"
                      value={donor.email}
                      onChange={(e) => update('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      className="mt-2"
                      placeholder="98765 43210"
                      value={donor.mobile}
                      onChange={(e) => update('mobile', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="pan">PAN Card Number</Label>
                    <Input
                      id="pan"
                      className={cn('mt-2 uppercase font-mono tracking-wider', donor.pan && !panValid && 'border-red-400')}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      value={donor.pan}
                      onChange={(e) => update('pan', e.target.value.toUpperCase())}
                    />
                    {donor.pan && !panValid ? (
                      <p className="mt-2 text-xs font-semibold text-red-600">Enter 5 letters, 4 numbers, and 1 final letter.</p>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">Required for issuing 80G Tax Exemption Certificate.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="h-fit border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-display text-2xl font-bold">Choose Impact</CardTitle>
                  <CardDescription>Every ₹10 sponsors 1 whole wheat roti with ghee.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedTier ? String(donor.amount) : 'custom'}
                    onValueChange={(value: string) => {
                      if (value !== 'custom') update('amount', Number(value))
                    }}
                    className="gap-3"
                  >
                    {donationTiers.map((tier) => (
                      <label
                        key={tier.amount}
                        className={cn(
                          'flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all',
                          donor.amount === tier.amount
                            ? 'border-primary bg-orange-50 ring-2 ring-primary/20'
                            : 'hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={String(tier.amount)} />
                          <span>
                            <span className="block font-bold text-foreground">₹{tier.amount.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-muted-foreground">Sponsor {tier.rotis} rotis</span>
                          </span>
                        </div>
                        {tier.amount === 1000 && (
                          <Badge className="border-orange-200 bg-white text-[10px] text-primary font-bold">Popular</Badge>
                        )}
                      </label>
                    ))}

                    <div className={cn('mt-1 rounded-2xl border p-4', !selectedTier && 'border-primary bg-orange-50')}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem onClick={() => update('amount', 5000)} value="custom" />
                        <div className="flex-1">
                          <Label htmlFor="custom" className="font-bold">Custom Amount</Label>
                          {!selectedTier && (
                            <Input
                              id="custom"
                              type="number"
                              min="100"
                              className="mt-2 bg-white"
                              value={donor.amount}
                              onChange={(e) => update('amount', Number(e.target.value))}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 flex items-center justify-between rounded-xl bg-secondary p-4">
                    <span className="text-sm font-semibold text-muted-foreground">Total Sponsored Impact</span>
                    <span className="font-bold text-primary text-lg">{rotis} Rotis</span>
                  </div>

                  {error && <p className="mt-4 text-xs font-bold text-red-600">{error}</p>}

                  <Button type="submit" className="mt-6 w-full shadow-lg font-bold glow-orange" size="lg">
                    Proceed to Pay ₹{donor.amount.toLocaleString('en-IN')} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </form>
          ) : (
            /* SUCCESS STATE */
            <div className="mx-auto mt-12 max-w-xl text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-emerald-100">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <Check className="h-10 w-10" />
              </div>
              <h2 className="font-display text-3xl font-bold">Thank You, {donor.name.split(' ')[0]}!</h2>
              <p className="text-sm text-muted-foreground">
                Your generous sponsorship of <span className="font-bold text-foreground">₹{donor.amount.toLocaleString('en-IN')}</span> will serve <span className="font-bold text-primary">{rotis} fresh rotis</span> to neighbors across Ahmedabad.
              </p>

              <div className="rounded-2xl bg-secondary/60 p-5 text-left text-sm space-y-2 border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contribution</span>
                  <span className="font-bold text-foreground">₹{donor.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt Reference</span>
                  <span className="font-bold text-foreground">{reference}</span>
                </div>
              </div>

              {saveError && <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">{saveError}</p>}

              <div className="flex flex-col gap-3 pt-2">
                <Button size="lg" className="w-full font-bold" onClick={() => setReceipt(true)}>
                  View & Print Official 80G Receipt
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
                  Return to Home Page
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Dynamic UPI / QR Checkout Modal */}
      <UpiPaymentModal
        isOpen={gateway}
        onClose={() => setGateway(false)}
        amount={donor.amount}
        donorName={donor.name}
        donorEmail={donor.email}
        onPaymentSuccess={completePayment}
      />

      {/* Receipt Modal */}
      <Dialog open={receipt} onOpenChange={setReceipt}>
        <DialogContent className="max-w-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold">Official Provisional Receipt</DialogTitle>
            <DialogDescription>Print or save this certificate for your 80G tax records.</DialogDescription>
          </DialogHeader>
          <Receipt donor={donor} reference={reference} />
          <div className="flex gap-3 mt-4">
            <Button className="w-full font-bold" onClick={() => window.print()}>
              Print Certificate (PDF)
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" className="w-full">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/donate" element={<Donation />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
    </Routes>
  )
}
