import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      host: true, // ✅ Helps Vercel and local network access
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true, // ✅ Clean dist/ folder before build
    },
    define: {
      'process.env': env,
    },
    preview: {
      port: 4173, // ✅ Vite preview defaults (good for testing before deploy)
      strictPort: true,
    },
  };
});
