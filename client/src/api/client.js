import axios from 'axios'

// Use environment variable for API URL, fallback to Azure backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://projectconnect-backend.azurewebsites.net/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable CORS credentials
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await api.get('/health')
    console.log('Backend connection successful:', response.data)
    return response.data
  } catch (error) {
    console.error('Backend connection failed:', error)
    throw error
  }
}

export default api