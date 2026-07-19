const AUTH_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
}

export const saveAuthSession = ({ accessToken, refreshToken, ...userData }) => {
  localStorage.setItem(AUTH_KEYS.accessToken, accessToken)
  localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken)
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(userData))
}

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_KEYS.accessToken)
  localStorage.removeItem(AUTH_KEYS.refreshToken)
  localStorage.removeItem(AUTH_KEYS.user)
}

export const getAccessToken = () => localStorage.getItem(AUTH_KEYS.accessToken)
export const getRefreshToken = () => localStorage.getItem(AUTH_KEYS.refreshToken)

export const getStoredUser = () => {
  const storedUser = localStorage.getItem(AUTH_KEYS.user)
  return storedUser ? JSON.parse(storedUser) : null
}

export const isAuthenticated = () => Boolean(localStorage.getItem(AUTH_KEYS.accessToken))
