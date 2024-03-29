import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
import path from 'path';
import removeConsole from "vite-plugin-remove-console";

console.log('B is', process.env.VITE_BRANCH);

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    headers:{
      "Content-Security-Policy" :"script-src 'self' 'unsafe-inline'",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
      overlay: false,
    }),
    removeConsole(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
