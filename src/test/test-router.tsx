import { Router, RouterProvider } from '@tanstack/react-router';
import { vi } from 'vitest';
import React from 'react';
import { RootRoute, Route } from '@tanstack/react-router';
import { QueryClient } from '@tanstack/react-query';

// Mock the Layout component to render children directly
vi.mock('@/shared/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the router module to prevent loading states
vi.mock('@/lib/router', () => ({
  LoadingFallback: () => null,
}));

// Create a test query client
const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
  },
});

// Create root route
const rootRoute = new RootRoute({
  component: ({ children }) => <>{children}</>,
});

// Create routes with simple components
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home</div>,
});

const bookRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/books/$bookId',
  component: () => <div>Book</div>,
});

const searchRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: () => <div>Search</div>,
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => <div>Profile</div>,
});

const shelfRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/shelf',
  component: () => <div>Shelf</div>,
});

const shelfDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/shelf/$shelfId',
  component: () => <div>Shelf Detail</div>,
});

const reservationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/reservations',
  component: () => <div>Reservations</div>,
});

// Create the route tree matching the actual router
const routeTree = rootRoute.addChildren([
  indexRoute,
  bookRoute,
  searchRoute,
  profileRoute,
  shelfRoute,
  shelfDetailRoute,
  reservationsRoute,
]);

// Create the router instance
export const router = new Router({
  routeTree,
  context: {
    queryClient: testQueryClient,
  },
});

// Register router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Test router provider that provides actual router context
export function TestRouterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouterProvider router={router} />;
}

// Export route paths for test usage
export const ROUTES = {
  HOME: '/',
  BOOK: (id: string) => `/books/${id}`,
  SEARCH: '/search',
  PROFILE: '/profile',
  SHELF: '/shelf',
  SHELF_DETAIL: (id: string) => `/shelf/${id}`,
  RESERVATIONS: '/reservations',
} as const;

// Mock route params for tests
export const mockRouteParams = {
  bookId: 'test-book-id',
  shelfId: 'test-shelf-id',
};
