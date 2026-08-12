import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  ShieldCheck
} from 'lucide-react'
import { Button, Input, Label, Card, CardContent } from '@/components/ui'
import { supabase } from '@/lib/supabase'

interface AuthProps {
  initialMode?: 'login' | 'signup'
}

export function AuthPage({ initialMode = 'login' }: AuthProps) {
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active tab from URL path if /login vs /signup
  const [isSignUp, setIsSignUp] = useState<boolean>(
    location.pathname === '/signup' || initialMode === 'signup'
  )

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup' || initialMode === 'signup')
  }, [location.pathname, initialMode])

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Feedback & Loading
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Redirect if already logged in (send them to where they came from, or home)
  const from = (location.state as any)?.from?.pathname ?? '/'
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(from, { replace: true })
      }
    })
  }, [navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!email || !password) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.')
        return
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.')
        return
      }
    }

    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        })

        if (error) throw error

        if (data.session) {
          setSuccessMsg('Account created successfully! Redirecting...')
          setTimeout(() => navigate(from, { replace: true }), 1200)
        } else {
          setSuccessMsg('Account created! Please check your email to confirm your registration.')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        if (data.session) {
          setSuccessMsg('Signed in successfully! Redirecting...')
          setTimeout(() => navigate(from, { replace: true }), 1000)
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An authentication error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg(null)
    setSocialLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // /auth/callback exchanges the PKCE code for a session
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in failed. Please try again.')
      setSocialLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setErrorMsg(null)
    if (!email) {
      setErrorMsg('Please enter your email address above, then click Forgot password.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      if (error) throw error
      setSuccessMsg('Password reset link sent! Check your email inbox.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 flex flex-col justify-between relative overflow-hidden">
      {/* Top Background Orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-orange-300/30 blur-3xl pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-md transition-transform group-hover:scale-105 glow-orange">
            रोटी
          </span>
          <span className="text-xl font-bold tracking-tight">
            Roti<span className="text-primary">On</span>Wheels
          </span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
              {/* Card Header with Tabs */}
              <div className="p-6 pb-4 bg-gradient-to-b from-amber-50/60 to-transparent border-b border-amber-100/50">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                    <Heart className="h-3.5 w-3.5 fill-amber-600 text-amber-600" /> Join Arham Seva Family
                  </span>
                </div>
                
                <h1 className="font-display text-2xl font-bold text-center text-foreground">
                  {isSignUp ? 'Create your Account' : 'Welcome Back'}
                </h1>
                <p className="text-xs text-center text-muted-foreground mt-1">
                  {isSignUp
                    ? 'Join thousands of donors serving hot rotis to those in need'
                    : 'Sign in to track your impacts, download receipts & manage donations'}
                </p>

                {/* Tab Switcher */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-secondary/80 rounded-2xl mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false)
                      navigate('/login')
                      setErrorMsg(null)
                      setSuccessMsg(null)
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      !isSignUp
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true)
                      navigate('/signup')
                      setErrorMsg(null)
                      setSuccessMsg(null)
                    }}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      isSignUp
                        ? 'bg-white text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-5">
                {/* Error Banner */}
                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-2.5 text-xs text-destructive font-medium"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Banner */}
                <AnimatePresence mode="wait">
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="e.g. Yash Bharvada"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-11 rounded-xl bg-secondary/30 border-secondary"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-secondary/30 border-secondary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-semibold">
                        Password
                      </Label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 rounded-xl bg-secondary/30 border-secondary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isSignUp && (
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 h-11 rounded-xl bg-secondary/30 border-secondary"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full rounded-xl font-bold shadow-md glow-orange mt-2 h-11"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </span>
                    ) : (
                      <span>{isSignUp ? 'Create Account' : 'Sign In to RotiOnWheels'}</span>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-secondary" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                    <span className="bg-white px-3 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Social Google Login Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={socialLoading}
                  className="w-full h-11 rounded-xl border-secondary font-semibold hover:bg-secondary/40 gap-2.5"
                >
                  {socialLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </Button>

                {/* Footer Switch Prompt */}
                <div className="pt-2 text-center text-xs text-muted-foreground">
                  {isSignUp ? (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(false)
                          navigate('/login')
                          setErrorMsg(null)
                          setSuccessMsg(null)
                        }}
                        className="font-bold text-primary hover:underline"
                      >
                        Sign In here
                      </button>
                    </p>
                  ) : (
                    <p>
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(true)
                          navigate('/signup')
                          setErrorMsg(null)
                          setSuccessMsg(null)
                        }}
                        className="font-bold text-primary hover:underline"
                      >
                        Create an Account
                      </button>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-6 text-xs text-muted-foreground flex items-center justify-center gap-1.5 z-10">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Secure 256-Bit SSL Encrypted Authentication • Arham Yuva Seva Group</span>
      </footer>
    </div>
  )
}
