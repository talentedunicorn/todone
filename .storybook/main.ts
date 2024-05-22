import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
	framework: '@storybook/svelte-vite',
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-svelte-csf',
		'@storybook/addon-coverage',
		'@chromatic-com/storybook'
	],
	docs: {}
};

export default config;
