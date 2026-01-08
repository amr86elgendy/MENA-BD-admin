import axios from 'axios'

import { getAccessTokenFromStore, useAuthStore } from '@/store/auth'

const baseURL = import.meta.env.VITE_API_URL
const headers = {
  'api-key': import.meta.env.VITE_API_KEY,
}

export const clientApi = axios.create({
  baseURL,
  withCredentials: true,
  headers,
  timeout: 10000,
})

// Track ongoing refresh requests to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

clientApi.interceptors.request.use(
  (config) => {
    const accessToken = getAccessTokenFromStore()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

clientApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Check for 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(clientApi(originalRequest))
          })
        })
      }
      isRefreshing = true

      try {
        // Use POST method and send refresh token via cookie (withCredentials handles this)
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          {
            headers,
            withCredentials: true,
          },
        )

        const { accessToken } = response.data

        if (!accessToken) {
          throw new Error('No access token in refresh response')
        }

        // Store the new access token in memory
        useAuthStore.getState().authenticateUser({
          accessToken,
        })

        // Notify all queued requests with new token
        onRefreshed(accessToken)

        // Update the authorization header for future requests
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return clientApi(originalRequest)
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        useAuthStore.getState().logUserOut()
        localStorage.removeItem('remember-me')
        // Redirect to login - use window.location for reliable navigation
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)
