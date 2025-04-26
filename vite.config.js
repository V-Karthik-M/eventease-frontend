import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // no './src', just 'src' is enough
      },
    },
    server: {
      port: 5173,
      open: true,
      host: '0.0.0.0', // ✅ Needed for external/local network access (good for testing on other devices too)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true, // ✅ Always clean old builds
    },
    define: {
      'process.env': env,
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: '0.0.0.0', // ✅ Same for preview server
    },
  };
});
