import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/svelte-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
	framework: getAbsolutePath('@storybook/svelte-vite'),
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		getAbsolutePath('@storybook/addon-links'),
		getAbsolutePath('@storybook/addon-svelte-csf'),
		getAbsolutePath('@storybook/addon-coverage'),
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-docs')
	],
	docs: {}
};

export default config;

function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, 'package.json')));
}
