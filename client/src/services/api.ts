/**
 * Axios API configuration for frontend requests.
 *
 * - Sets the base URL for backend API calls (http://localhost:4000/api).
 * - Automatically attaches the JWT token from localStorage to the
 *   Authorization header if available, allowing authenticated requests.
 */

import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
})

// Interceptor: Add JWT token to all requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
