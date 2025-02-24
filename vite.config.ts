import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import visualizer from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression(), // Generates compressed bundles
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react'
            }
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack'
            }
            if (id.includes('zustand')) {
              return 'vendor-zustand'
            }
            return 'vendor-other'
          }
          // Feature-based code splitting
          if (id.includes('src/features/')) {
            const feature = id.split('src/features/')[1].split('/')[0]
            return `feature-${feature}`
          }
        },
        // Optimize chunk loading
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || ''
          if (name.startsWith('feature-')) {
            return 'assets/[name]-[hash].js'
          }
          return 'assets/[name]-[hash].js'
        }
      }
    },
    target: 'esnext',
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    // Split CSS
    cssCodeSplit: true,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Optimize assets
    assetsInlineLimit: 4096
  },
  server: {
    port: 3000,
    strictPort: true
  },
  // Optimize dev performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@tanstack/router',
      'zustand'
    ]
  }
})