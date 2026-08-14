import { useState, useEffect } from 'react'
import { clearAuthSession, getStoredUser, isAuthenticated, saveAuthSession } from '../../utils/authStorage'
import axiosClient from '../services/axiosClient'

const DEMO_CREDENTIALS = {
  username: 'emilys',
  password: 'emilyspass',
}

/**
 * Centralises all authentication state and actions.
 * Returns: { user, isLoggedIn, loading, error, login, logout }
 */
export function useAuth() {
  const [user, setUser] = useState(() => getStoredUser())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setUser(userData)
      return { success: true }
    } catch (err) {
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

  return {
    user,
    isLoggedIn: isAuthenticated() && !!user,
    loading,
    error,
    login,
    logout,
  }
}
