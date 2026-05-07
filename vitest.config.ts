import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [svelte(), svelteTesting()],
	ssr: {
		noExternal: ['@testing-library/svelte', 'svelte']
	},
	test: {
		dangerouslyIgnoreUnhandledErrors: true,
		setupFiles: ['./tests/vitest.setup.ts'],
		include: ['tests/**/*.test.ts'],
		exclude: ['tests/**/*.stories.ts'],
		environment: 'jsdom'
	}
});
