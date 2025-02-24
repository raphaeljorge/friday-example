import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Reservations = lazy(() => import('@/features/reservations/components/Reservations'))

const LoadingFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="space-y-3">
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
  </div>
)

export const Route = createFileRoute('/reservations')({
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <Reservations />
    </Suspense>
  )
})