import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'tests/setup.ts',
    coverage:{
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      enabled: true,
      include: ['src/app/admin/page.tsx', 'src/app/cashier/page.jsx', 'src/app/kitchen/page.tsx','src/app/manager/page.tsx' ,'src/app/static_menu/page.jsx', 'src/app/cashier/page.jsx'],
    },
  },
});