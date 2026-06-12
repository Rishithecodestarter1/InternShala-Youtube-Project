// ProtectedRoute.jsx - Redirects users to the auth page when they try to access protected screens.
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
}

export default ProtectedRoute
