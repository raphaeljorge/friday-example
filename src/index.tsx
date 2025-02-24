import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Import global styles
import './styles/globals.css'

// Initialize MSW in development
async function enableMocking() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass'
    })
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

// Create a router instance
const router = new Router({
  routeTree,
  context: {
    queryClient
  }
})

// Register router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Register service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        type: 'module',
      })
      console.log('Service worker registered:', registration)
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  }
}

// Start the application
const startApp = async () => {
  // Enable MSW in development
  await enableMocking()

  // Register service worker in production
  if (process.env.NODE_ENV === 'production') {
    await registerServiceWorker()
  }

  // Render the app
  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

startApp()