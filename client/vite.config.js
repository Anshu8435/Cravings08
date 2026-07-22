import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    isolate: false,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
      include: [
        'src/App.jsx',
        'src/context/**',
        'src/components/ErrorBoundary.jsx',
        'src/components/Loader.jsx',
        'src/components/NoDataFound.jsx',
        'src/components/DishCard.jsx',
        'src/components/Footer.jsx',
        'src/components/home/CTASection.jsx',
        'src/components/home/StatisticsSection.jsx',
        'src/components/home/CustomerFeedbackSection.jsx',
      ],
      exclude: ['src/**/*.test.*', 'src/test/**', 'src/**/index.*'],
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'vendor';
            }
            if (id.includes('react-icons') || id.includes('react-hot-toast')) {
              return 'ui';
            }
          }
        },
      },
    },
  },
});
