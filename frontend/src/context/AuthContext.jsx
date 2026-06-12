// AuthContext.jsx - Provides authentication state to the app and persists login via localStorage.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (authData) => {
    const nextUser = {
      id: authData.userId,
      username: authData.username,
      avatar: authData.avatar || '',
      channels: authData.channels || [],
    }

    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(nextUser))
    setToken(authData.token)
    setUser(nextUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
  }

  const updateUser = (nextUserData) => {
    setUser((currentUser) => {
      const mergedUser = { ...currentUser, ...nextUserData }
      localStorage.setItem('user', JSON.stringify(mergedUser))
      return mergedUser
    })
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, logout, updateUser }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
