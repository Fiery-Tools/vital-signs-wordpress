import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build',
        manifest: true,
        rollupOptions: {
            input: resolve(__dirname, 'src/main.jsx'),

        },
        emptyOutDir: true
    },
    server: {
        cors: true,
        origin: 'http://winds:5173',
        port: 5173,
        host: '0.0.0.0',
        strictPort: true,
    },
});
