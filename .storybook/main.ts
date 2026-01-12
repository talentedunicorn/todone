import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
	framework: '@storybook/svelte-vite',
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-svelte-csf',
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
		'@storybook/addon-vitest'
	],
	docs: {}
};

export default config;
