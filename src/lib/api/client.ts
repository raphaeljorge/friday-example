import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error occurred'))
    }

    // Handle API errors
    const { status, data } = error.response
    let message = data?.message || 'An error occurred'

    switch (status) {
      case 401:
        message = 'Unauthorized access'
        break
      case 403:
        message = 'Access forbidden'
        break
      case 404:
        message = 'Resource not found'
        break
      case 500:
        message = 'Internal server error'
        break
    }

    return Promise.reject(new Error(message))
  }
)