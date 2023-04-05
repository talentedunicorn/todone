const path = require('path');
module.exports = {
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-svelte-csf'
	],
	framework: '@storybook/sveltekit',
	features: {
		storyStoreV7: true
	},
	viteFinal: async (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			$lib: path.resolve(__dirname, '../src/lib'),
			'$env/static/public': process.env
		};
		return config;
	},
	docs: {
		autodocs: true
	}
};
