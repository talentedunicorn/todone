export default {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-svelte-csf'
	],
	framework: {
		name: '@storybook/svelte-vite',
		options: {
			preprocess: undefined
		}
	},
	features: {
		storyStoreV7: true
	},
	docs: {
		autodocs: true
	}
};
