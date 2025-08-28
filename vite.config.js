import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

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
    optimizeDeps: {
        exclude: ['lucide-react']
    },
    resolve: {
        alias: {
            'lucide-react/icons': fileURLToPath(
                new URL('./node_modules/lucide-react/dist/esm/icons', import.meta.url)
            ),
            // Sets '@' to point to the 'src' directory.
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },

    },
    server: {
        cors: true,
        origin: 'http://winds:5173',
        port: 5173,
        host: '0.0.0.0',
        strictPort: true,
    },
});
