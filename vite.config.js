import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process';
// https://vite.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(
      execSync('git rev-parse --short HEAD').toString().trim()
    ),},
  plugins: [vue(),tailwindcss(),],
  optimizeDeps: {
    exclude: ['js-big-decimal']}
})
