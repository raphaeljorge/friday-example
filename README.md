```
src/
├── assets/                 # Static assets (images, fonts, global styles)
├── features/              # Feature modules (core business logic)
│   ├── auth/             # Authentication feature
│   │   ├── api/         # Feature-specific API integration
│   │   ├── components/  # UI components specific to auth
│   │   ├── hooks/      # Custom hooks for auth logic
│   │   ├── store/      # Auth state management
│   │   ├── types/      # TypeScript interfaces and types
│   │   └── utils/      # Auth-specific utilities
│   └── dashboard/        # Dashboard and analytics feature
├── shared/               # Cross-cutting concerns
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Generic custom hooks
│   ├── types/          # Shared TypeScript definitions
│   └── utils/          # Common utility functions
├── styles/              # Global styling system
├── lib/                 # Third-party service integrations
└── config/              # Environment and app configuration
```

```
feature/                # Root of a feature module
├── api/               # API Integration Layer
│   ├── endpoints.ts   # REST/GraphQL endpoint configurations
│   └── queries.ts     # Data fetching hooks with TanStack Query
├── components/        # UI Components Layer
│   ├── index.ts      # Public component exports
│   └── [ComponentName]/
│       ├── index.tsx   # Component logic and JSX
│       ├── styles.module.css  # Scoped component styles
│       └── tests/      # Unit and integration tests
├── hooks/            # Custom Logic Layer
│   └── index.ts      # Reusable feature-specific hooks
├── store/            # State Management Layer
│   └── index.ts      # Feature-specific Zustand store
├── types/            # Type Definitions Layer
│   └── index.ts      # TypeScript types and interfaces
└── utils/            # Utilities Layer
    └── index.ts      # Helper functions and constants
```