import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */

const kit = {
	adapter: adapter(),
	vite : {
		define : {
			"process.env" : process.env
		}
	}
}	

const config = {
	kit
};

export default config;
