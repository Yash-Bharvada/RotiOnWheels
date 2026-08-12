import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

/**
 * Handles the OAuth redirect back from the provider.
 * Supabase sends ?code=... to this page; we exchange it for a session (PKCE flow).
 */
export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) {
            console.error('[AuthCallback] code exchange failed:', error.message)
            navigate('/login?error=oauth_failed', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        })
    } else {
      // No code — perhaps a direct visit; send them home
      navigate('/', { replace: true })
    }
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white text-2xl font-bold shadow-lg">
        रोटी
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        Completing sign-in…
      </div>
    </div>
  )
}
