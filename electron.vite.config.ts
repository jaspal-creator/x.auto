import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: [],
        include: ['better-sqlite3']
      })
    ],
    define: {
      'process.env.MAIN_VITE_DB_NAME': JSON.stringify(process.env.MAIN_VITE_DB_NAME),
      'process.env.MAIN_VITE_ENC_KEY': JSON.stringify(process.env.MAIN_VITE_ENC_KEY),
      'process.env.MAIN_VITE_ENC_ALG': JSON.stringify(process.env.MAIN_VITE_ENC_ALG),
      'process.env.MAIN_VITE_ENC_IV': JSON.stringify(process.env.MAIN_VITE_ENC_IV),
      'process.env.MAIN_VITE_SESS_EXPIRE': JSON.stringify(process.env.MAIN_VITE_SESS_EXPIRE)
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        interfaces: resolve('src/interfaces')
      }
    },
    plugins: [react()],
    optimizeDeps: {
      esbuildOptions: {
        plugins: [fixReactVirtualized]
      }
    }
  }
});
