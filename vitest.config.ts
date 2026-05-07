import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from './vite.config';
const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			dangerouslyIgnoreUnhandledErrors: true,
			projects: [
				{
					extends: true,
					test: {
						name: 'unit',
						include: ['tests/**/*.test.ts']
					}
				},
				{
					extends: true,
					plugins: [
						storybookTest({
							configDir: path.join(dirname, '.storybook')
						})
					],
					test: {
						name: 'storybook',
						browser: {
							enabled: true,
							headless: true,
							provider: playwright({}),
							instances: [
								{
									browser: 'chromium'
								}
							]
						}
					}
				}
			],
			coverage: {
				reporter: ['text', 'html', 'json', 'json-summary']
			}
		}
	})
);
