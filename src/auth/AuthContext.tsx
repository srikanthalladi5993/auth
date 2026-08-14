import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearAuthSession, getStoredUser, isAuthenticated, saveAuthSession } from '../utils/authStorage'
import axiosClient from '../shared/services/axiosClient'

const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
}

export interface AuthUser {
  id?: string | number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  gender?: string
  image?: string
  role?: string | string[]
  permissions?: string[]
}

export interface AuthContextValue {
  user: AuthUser | null
  isLoggedIn: boolean
  loading: boolean
  error: string
  roles: string[]
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  login: (args?: { username?: string; password?: string }) => Promise<{ success: boolean }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = user?.role ? (Array.isArray(user.role) ? user.role : [user.role]) : ['user']
  const hasRole = (role: string) => roles.includes(role)
  const hasPermission = (permission: string) => (user?.permissions ?? []).includes(permission)

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  const login = async ({ username = DEMO_CREDENTIALS.username, password = DEMO_CREDENTIALS.password } = {}) => {
    setLoading(true)
    setError('')

    try {
      const response = await axiosClient.post('/auth/login', { username, password })
      const { accessToken, refreshToken, ...userData } = response.data
      saveAuthSession({ accessToken, refreshToken, ...userData })
      setUser(userData as AuthUser)
      return { success: true }
    } catch {
      setError('Login failed. Please check the credentials and try again.')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuthSession()
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoggedIn: isAuthenticated() && !!user,
      loading,
      error,
      roles,
      hasRole,
      hasPermission,
      login,
      logout,
    }),
    [user, loading, error, roles],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
