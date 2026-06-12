// axiosInstance.js - Configured Axios instance that automatically attaches the JWT token to requests.
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      if (window.location.pathname !== '/auth') {
        window.location.assign('/auth')
      }
    }

    return Promise.reject(error)
  },
)

export default api
