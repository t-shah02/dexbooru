const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	darkMode: 'class',
	plugins: [require('flowbite/plugin'), require('flowbite-typography')]
};

module.exports = config;
