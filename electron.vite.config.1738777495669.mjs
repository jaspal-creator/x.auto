// electron.vite.config.ts
import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized';
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
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
export { electron_vite_config_default as default };
