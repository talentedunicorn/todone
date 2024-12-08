/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [require('autoprefixer'), require('@csstools/postcss-light-dark-function')]
};

module.exports = config;
