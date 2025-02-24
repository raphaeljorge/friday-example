import { Outlet } from '@tanstack/react-router'
import { Navigation } from '../Navigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}