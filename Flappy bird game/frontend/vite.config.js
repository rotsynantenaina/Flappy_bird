import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    loader: 'jsx', // Indique à esbuild de traiter JSX dans les fichiers .js
  },
  plugins: [],
});
