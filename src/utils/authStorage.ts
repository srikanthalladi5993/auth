import type { AuthSession, AuthUser } from '../types'

const AUTH_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
} as const

export const saveAuthSession = ({ accessToken, refreshToken, ...userData }: AuthSession & AuthUser) => {
  localStorage.setItem(AUTH_KEYS.accessToken, accessToken)
  localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken)
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(userData))
}

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_KEYS.accessToken)
  localStorage.removeItem(AUTH_KEYS.refreshToken)
  localStorage.removeItem(AUTH_KEYS.user)
}

export const getAccessToken = (): string | null => localStorage.getItem(AUTH_KEYS.accessToken)
export const getRefreshToken = (): string | null => localStorage.getItem(AUTH_KEYS.refreshToken)

export const getStoredUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_KEYS.user)
  return storedUser ? (JSON.parse(storedUser) as AuthUser) : null
}

export const isAuthenticated = (): boolean => Boolean(localStorage.getItem(AUTH_KEYS.accessToken))
