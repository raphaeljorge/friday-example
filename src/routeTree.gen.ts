/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as ShelfImport } from './routes/shelf';
import { Route as SearchImport } from './routes/search';
import { Route as ReservationsImport } from './routes/reservations';
import { Route as ProfileImport } from './routes/profile';
import { Route as IndexImport } from './routes/index';
import { Route as ShelfShelfIdImport } from './routes/shelf.$shelfId';
import { Route as BooksBookIdImport } from './routes/books.$bookId';

// Create/Update Routes

const ShelfRoute = ShelfImport.update({
  id: '/shelf',
  path: '/shelf',
  getParentRoute: () => rootRoute,
} as any);

const SearchRoute = SearchImport.update({
  id: '/search',
  path: '/search',
  getParentRoute: () => rootRoute,
} as any);

const ReservationsRoute = ReservationsImport.update({
  id: '/reservations',
  path: '/reservations',
  getParentRoute: () => rootRoute,
} as any);

const ProfileRoute = ProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

const ShelfShelfIdRoute = ShelfShelfIdImport.update({
  id: '/$shelfId',
  path: '/$shelfId',
  getParentRoute: () => ShelfRoute,
} as any);

const BooksBookIdRoute = BooksBookIdImport.update({
  id: '/books/$bookId',
  path: '/books/$bookId',
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/profile': {
      id: '/profile';
      path: '/profile';
      fullPath: '/profile';
      preLoaderRoute: typeof ProfileImport;
      parentRoute: typeof rootRoute;
    };
    '/reservations': {
      id: '/reservations';
      path: '/reservations';
      fullPath: '/reservations';
      preLoaderRoute: typeof ReservationsImport;
      parentRoute: typeof rootRoute;
    };
    '/search': {
      id: '/search';
      path: '/search';
      fullPath: '/search';
      preLoaderRoute: typeof SearchImport;
      parentRoute: typeof rootRoute;
    };
    '/shelf': {
      id: '/shelf';
      path: '/shelf';
      fullPath: '/shelf';
      preLoaderRoute: typeof ShelfImport;
      parentRoute: typeof rootRoute;
    };
    '/books/$bookId': {
      id: '/books/$bookId';
      path: '/books/$bookId';
      fullPath: '/books/$bookId';
      preLoaderRoute: typeof BooksBookIdImport;
      parentRoute: typeof rootRoute;
    };
    '/shelf/$shelfId': {
      id: '/shelf/$shelfId';
      path: '/$shelfId';
      fullPath: '/shelf/$shelfId';
      preLoaderRoute: typeof ShelfShelfIdImport;
      parentRoute: typeof ShelfImport;
    };
  }
}

// Create and export the route tree

interface ShelfRouteChildren {
  ShelfShelfIdRoute: typeof ShelfShelfIdRoute;
}

const ShelfRouteChildren: ShelfRouteChildren = {
  ShelfShelfIdRoute: ShelfShelfIdRoute,
};

const ShelfRouteWithChildren = ShelfRoute._addFileChildren(ShelfRouteChildren);

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/profile': typeof ProfileRoute;
  '/reservations': typeof ReservationsRoute;
  '/search': typeof SearchRoute;
  '/shelf': typeof ShelfRouteWithChildren;
  '/books/$bookId': typeof BooksBookIdRoute;
  '/shelf/$shelfId': typeof ShelfShelfIdRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/profile': typeof ProfileRoute;
  '/reservations': typeof ReservationsRoute;
  '/search': typeof SearchRoute;
  '/shelf': typeof ShelfRouteWithChildren;
  '/books/$bookId': typeof BooksBookIdRoute;
  '/shelf/$shelfId': typeof ShelfShelfIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/profile': typeof ProfileRoute;
  '/reservations': typeof ReservationsRoute;
  '/search': typeof SearchRoute;
  '/shelf': typeof ShelfRouteWithChildren;
  '/books/$bookId': typeof BooksBookIdRoute;
  '/shelf/$shelfId': typeof ShelfShelfIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | '/'
    | '/profile'
    | '/reservations'
    | '/search'
    | '/shelf'
    | '/books/$bookId'
    | '/shelf/$shelfId';
  fileRoutesByTo: FileRoutesByTo;
  to:
    | '/'
    | '/profile'
    | '/reservations'
    | '/search'
    | '/shelf'
    | '/books/$bookId'
    | '/shelf/$shelfId';
  id:
    | '__root__'
    | '/'
    | '/profile'
    | '/reservations'
    | '/search'
    | '/shelf'
    | '/books/$bookId'
    | '/shelf/$shelfId';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  ProfileRoute: typeof ProfileRoute;
  ReservationsRoute: typeof ReservationsRoute;
  SearchRoute: typeof SearchRoute;
  ShelfRoute: typeof ShelfRouteWithChildren;
  BooksBookIdRoute: typeof BooksBookIdRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ProfileRoute: ProfileRoute,
  ReservationsRoute: ReservationsRoute,
  SearchRoute: SearchRoute,
  ShelfRoute: ShelfRouteWithChildren,
  BooksBookIdRoute: BooksBookIdRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/profile",
        "/reservations",
        "/search",
        "/shelf",
        "/books/$bookId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/profile": {
      "filePath": "profile.tsx"
    },
    "/reservations": {
      "filePath": "reservations.tsx"
    },
    "/search": {
      "filePath": "search.tsx"
    },
    "/shelf": {
      "filePath": "shelf.tsx",
      "children": [
        "/shelf/$shelfId"
      ]
    },
    "/books/$bookId": {
      "filePath": "books.$bookId.tsx"
    },
    "/shelf/$shelfId": {
      "filePath": "shelf.$shelfId.tsx",
      "parent": "/shelf"
    }
  }
}
ROUTE_MANIFEST_END */
