import {resolve} from 'path'
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {lingui} from "@lingui/vite-plugin";

// https://vite.dev/config/
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
    lingui(),
  ],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/smarthome-challenge',
});