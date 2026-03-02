import { defineConfig } from 'tsup'

export default defineConfig([
  // Core + HTML builders
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    dts: true,
    clean: true,
    outDir: 'dist',
  },
  // MCP server adapter
  {
    entry: { 'mcp/index': 'src/mcp/index.ts' },
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    external: ['@modelcontextprotocol/sdk', 'zod'],
  },
  // CLI
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    outDir: 'dist',
    banner: { js: '#!/usr/bin/env node' },
  },
  // React adapter
  {
    entry: { 'react/index': 'src/react/index.tsx' },
    format: ['esm'],
    dts: true,
    outDir: 'dist',
    external: ['react', 'react/jsx-runtime'],
  },
])
