import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: "/", 
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), 
      },
    },
    server: {
      port: 5173,
      open: true,
      host: '0.0.0.0', 
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true, 
    },
    define: {
      'process.env': env,
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: '0.0.0.0', 
    },
  };
});
