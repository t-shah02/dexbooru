import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */

const kit = {
	adapter: adapter(),
	
}	

const config = {
	kit
};

export default config;
