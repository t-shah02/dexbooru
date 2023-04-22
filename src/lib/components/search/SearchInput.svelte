<script lang="ts">
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import type { Post } from '$lib/interfaces/posts';
	import { getSavedPostIds } from '$lib/posts/saved';
	import { authenticatedUser } from '$lib/stores/userStores';
	import Lens from '../svgs/Lens.svelte';
	import queryResults from '$lib/stores/searchStores';
	import type PostSearcher from '$lib/query/autocomplete';

	export let searchResultsSavedPostIds: string[] = [];
	export let loading = false;
	export let postSearcher: PostSearcher;
	export let query: string;

	let canSearch = true;

	const findPosts = async (event: FormEventHandler<HTMLInputElement>) => {
		if (!canSearch) {
			return;
		}

		const target = event.target as HTMLInputElement;
		query = target.value;
		const prevQuery = query;

		loading = true;
		await postSearcher.search(query);
		loading = false;

		canSearch = false;
		setTimeout(async () => {
			canSearch = true;
			query = target.value;

			if (query !== prevQuery) {
				await findPosts(event);
			}
		}, 2000);
	};
</script>

<div class="relative w-1/2 m-auto z-50">
	<input
		on:input={findPosts}
		type="search"
		class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
		placeholder="Search for posts with any tags, artists or uploaders you want"
	/>
	<button
		type="button"
		class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
	>
		<Lens />
		<span class="sr-only">Search</span>
	</button>
</div>
