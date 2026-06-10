import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version)
	},
	build: {
		sourcemap: true
	},
	plugins: [
		svelte(),
		VitePWA({
			workbox: {
				globPatterns: ['**/*.{js,css,html,ttf}'],
				maximumFileSizeToCacheInBytes: 5 * 1024 ** 2 // 5MB
			},
			manifest: {
				name: 'ToDone',
				short_name: 'ToDone',
				start_url: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: 'logo.svg',
						type: 'image/svg+xml',
						sizes: 'any'
					},
					{
						src: 'logo-512.png',
						type: 'image/png',
						sizes: '512x512'
					},
					{
						src: 'logo-192.png',
						type: 'image/png',
						sizes: '192x192'
					}
				]
			}
		}),
		sentryVitePlugin({
			authToken: process.env.SENTRY_AUTH_TOKEN,
			org: 'talentedunicorn',
			project: 'todone'
		})
	]
});
