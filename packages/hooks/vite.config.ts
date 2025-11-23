import { readFileSync } from 'fs'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }))

const globals = {
  ...(packageJson?.dependencies || {}),
}

export default defineConfig(({ command }) => {
  const isLibrary = command === 'build'

  if (isLibrary) {
    return {
      plugins: [
        react(),
        dts({
          outDir: 'dist',
          include: ['src/index.ts', 'src/hooks/**/*'],
          exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
          tsconfigPath: './tsconfig.build.json',
        }),
      ],
      build: {
        lib: {
          entry: 'src/index.ts',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'lodash', 'lodash-es', 'react/jsx-runtime', ...Object.keys(globals)],
          output: {
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: ({ name }) => `${name}.${name.endsWith('index') ? 'mjs' : 'js'}`,
          },
        },
        copyPublicDir: false,
      },
    }
  }

  return {
    plugins: [react()],
  }
})
