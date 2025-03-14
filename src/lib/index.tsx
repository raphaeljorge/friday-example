import { lazy } from 'react';

// Lazy-loaded components with error boundaries and loading states
export const Books = lazy(
  () =>
    import(/* webpackChunkName: "books" */ '@/features/books/components/Books')
);
export const BookDetails = lazy(
  () =>
    import(
      /* webpackChunkName: "book-details" */ '@/features/books/components/BookDetails'
    )
);
export const Search = lazy(
  () =>
    import(
      /* webpackChunkName: "search" */ '@/features/search/components/Search'
    )
);
export const Profile = lazy(
  () =>
    import(
      /* webpackChunkName: "profile" */ '@/features/profile/components/Profile'
    )
);
export const Shelf = lazy(
  () =>
    import(/* webpackChunkName: "shelf" */ '@/features/shelf/components/Shelf')
);
export const ShelfView = lazy(
  () =>
    import(
      /* webpackChunkName: "shelf-view" */ '@/features/shelf/components/ShelfView'
    )
);
export const Reservations = lazy(
  () =>
    import(
      /* webpackChunkName: "reservations" */ '@/features/reservations/components/Reservations'
    )
);

// Loading component
export const LoadingFallback = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="space-y-3">
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Wrapper component with Suspense and error boundary
export const withSuspense =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
