import axios, { AxiosHeaders } from 'axios'
import { clearAuthSession, getAccessToken, getRefreshToken, saveAuthSession } from '../../utils/authStorage'

// Step 2: create a custom axios instance
// This is like making one smart HTTP client for our app.
const axiosClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Step 3: add a request interceptor
// This runs before every request and attaches the token automatically.
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers = new AxiosHeaders(config.headers)
      config.headers.set('Authorization', `Bearer ${token}`)
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Step 4: add a response interceptor
// This runs when the server responds with an error.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
          clearAuthSession()
          window.location.href = '/'
          return Promise.reject(error)
        }

        const refreshResponse = await axios.post('https://dummyjson.com/auth/refresh', {
          refreshToken,
        })

        const { accessToken, refreshToken: nextRefreshToken, ...userData } = refreshResponse.data
        saveAuthSession({ accessToken, refreshToken: nextRefreshToken, ...userData })

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosClient(originalRequest)
      } catch (refreshError) {
        clearAuthSession()
        window.location.href = '/'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
