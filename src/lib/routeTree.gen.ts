/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './__root'
import { Route as RouterImport } from './router'
import { Route as IndexImport } from './index'
import { Route as RoutesIndexImport } from './routes/index'
import { Route as RouteTreeGenImport } from './routeTree.gen'
import { Route as DbIndexeddbImport } from './db/indexeddb'
import { Route as ContextThemeContextImport } from './context/ThemeContext'

// Create/Update Routes

const RouterRoute = RouterImport.update({
  id: '/router',
  path: '/router',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const RoutesIndexRoute = RoutesIndexImport.update({
  id: '/routes/',
  path: '/routes/',
  getParentRoute: () => rootRoute,
} as any)

const RouteTreeGenRoute = RouteTreeGenImport.update({
  id: '/routeTree/gen',
  path: '/routeTree/gen',
  getParentRoute: () => rootRoute,
} as any)

const DbIndexeddbRoute = DbIndexeddbImport.update({
  id: '/db/indexeddb',
  path: '/db/indexeddb',
  getParentRoute: () => rootRoute,
} as any)

const ContextThemeContextRoute = ContextThemeContextImport.update({
  id: '/context/ThemeContext',
  path: '/context/ThemeContext',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/router': {
      id: '/router'
      path: '/router'
      fullPath: '/router'
      preLoaderRoute: typeof RouterImport
      parentRoute: typeof rootRoute
    }
    '/context/ThemeContext': {
      id: '/context/ThemeContext'
      path: '/context/ThemeContext'
      fullPath: '/context/ThemeContext'
      preLoaderRoute: typeof ContextThemeContextImport
      parentRoute: typeof rootRoute
    }
    '/db/indexeddb': {
      id: '/db/indexeddb'
      path: '/db/indexeddb'
      fullPath: '/db/indexeddb'
      preLoaderRoute: typeof DbIndexeddbImport
      parentRoute: typeof rootRoute
    }
    '/routeTree/gen': {
      id: '/routeTree/gen'
      path: '/routeTree/gen'
      fullPath: '/routeTree/gen'
      preLoaderRoute: typeof RouteTreeGenImport
      parentRoute: typeof rootRoute
    }
    '/routes/': {
      id: '/routes/'
      path: '/routes'
      fullPath: '/routes'
      preLoaderRoute: typeof RoutesIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/router': typeof RouterRoute
  '/context/ThemeContext': typeof ContextThemeContextRoute
  '/db/indexeddb': typeof DbIndexeddbRoute
  '/routeTree/gen': typeof RouteTreeGenRoute
  '/routes': typeof RoutesIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/router': typeof RouterRoute
  '/context/ThemeContext': typeof ContextThemeContextRoute
  '/db/indexeddb': typeof DbIndexeddbRoute
  '/routeTree/gen': typeof RouteTreeGenRoute
  '/routes': typeof RoutesIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/router': typeof RouterRoute
  '/context/ThemeContext': typeof ContextThemeContextRoute
  '/db/indexeddb': typeof DbIndexeddbRoute
  '/routeTree/gen': typeof RouteTreeGenRoute
  '/routes/': typeof RoutesIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/router'
    | '/context/ThemeContext'
    | '/db/indexeddb'
    | '/routeTree/gen'
    | '/routes'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/router'
    | '/context/ThemeContext'
    | '/db/indexeddb'
    | '/routeTree/gen'
    | '/routes'
  id:
    | '__root__'
    | '/'
    | '/router'
    | '/context/ThemeContext'
    | '/db/indexeddb'
    | '/routeTree/gen'
    | '/routes/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  RouterRoute: typeof RouterRoute
  ContextThemeContextRoute: typeof ContextThemeContextRoute
  DbIndexeddbRoute: typeof DbIndexeddbRoute
  RouteTreeGenRoute: typeof RouteTreeGenRoute
  RoutesIndexRoute: typeof RoutesIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  RouterRoute: RouterRoute,
  ContextThemeContextRoute: ContextThemeContextRoute,
  DbIndexeddbRoute: DbIndexeddbRoute,
  RouteTreeGenRoute: RouteTreeGenRoute,
  RoutesIndexRoute: RoutesIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/router",
        "/context/ThemeContext",
        "/db/indexeddb",
        "/routeTree/gen",
        "/routes/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/router": {
      "filePath": "router.tsx"
    },
    "/context/ThemeContext": {
      "filePath": "context/ThemeContext.tsx"
    },
    "/db/indexeddb": {
      "filePath": "db/indexeddb.ts"
    },
    "/routeTree/gen": {
      "filePath": "routeTree.gen.ts"
    },
    "/routes/": {
      "filePath": "routes/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
