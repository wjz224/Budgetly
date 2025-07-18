import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
    plugins: [react()],
    base: '/',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: isDev
        ? {
            host: '127.0.0.1',
            https: {
                key: fs.readFileSync(path.resolve(__dirname, '../../key.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../cert.pem')),
            },
            port: 3000,
        }
        : undefined,
});