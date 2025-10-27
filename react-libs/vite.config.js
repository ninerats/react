import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],    
  build: {
    lib: {
      entry: 'components/index.js',        // <— uses your current layout
      name: 'ReactLibs',
      formats: ['es', 'umd'],
      fileName: (f) => (f === 'es' ? 'index.es.js' : 'index.umd.cjs')
    },
    rollupOptions: {
      external: ['react', 'react-dom']     // don't bundle React
    }
  }
});
