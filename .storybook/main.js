const istanbul = require('vite-plugin-istanbul');
const constants = require('@storybook/addon-coverage/dist/cjs/constants');
const { mergeConfig } = require('vite');

export default {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-coverage',
		'@storybook/addon-svelte-csf'
	],
	framework: {
		name: '@storybook/svelte-vite',
		options: {
			preprocess: undefined
		}
	},
	features: {
		storyStoreV7: true,
		buildStoriesJson: true
	},
	docs: {
		autodocs: true
	},
	async viteFinal(config) {
		return mergeConfig(config, {
			build: {
				sourcemap: true
			},
			plugins: [
				istanbul({
					exclude: constants.defaultExclude,
					extension: constants.defaultExtensions
				})
			]
		});
	}
};
