import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Remotion可能需要这些配置
      build: {
        target: 'es2022',
        minify: mode === 'production',
        sourcemap: mode !== 'production',
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      },
      // 优化Remotion的依赖处理
      optimizeDeps: {
        include: ['react', 'react-dom', '@remotion/player', 'remotion'],
      },
    };
});
