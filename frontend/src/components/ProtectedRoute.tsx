import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

/**
 * Wraps routes that require authentication.
 * - While session is loading → shows a centered spinner
 * - If not authenticated → redirects to /login, preserving the intended destination
 * - If authenticated → renders the child route via <Outlet>
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white text-2xl font-bold shadow-lg animate-pulse">
          रोटी
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading your account…
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to /login and remember where they came from so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
