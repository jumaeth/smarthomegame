import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'macros', // required for macro expansion
          '@lingui/babel-plugin-lingui-macro', // Lingui macro support
        ],
      },
    }),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/',
});
