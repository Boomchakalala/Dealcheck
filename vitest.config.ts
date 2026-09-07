import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Mirrors tsconfig's `@/*` → `src/*` so modules under test can import the
// same way the app does. No environment beyond node: these are pure-logic tests.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
