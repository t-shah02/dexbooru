<script lang="ts">
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import type { AutocompleteResults } from '$lib/interfaces/queries';
	import LoadingSpinner from '../svgs/LoadingSpinner.svelte';
	import OptionsDropdown from './OptionsDropdown.svelte';

	let canSearch = true;
	let results: AutocompleteResults | null = null;
	let loading = false;

	const searchCache = new Map<string, AutocompleteResults>();

	const emptyResults: AutocompleteResults = {
		users: [],
		tags: [],
		artists: []
	};

	const getAutocompleteResults = async (target: HTMLInputElement) => {
		if (!canSearch) return;

		const value = target.value;

		if (value === '') {
			results = null;
			canSearch = true;

			return;
		}

		if (searchCache.has(value)) {
			results = searchCache.get(value) as AutocompleteResults;
			return;
		}

		const autocompleteURL = new URL('/api/autocomplete', document.location.toString());
		autocompleteURL.searchParams.append('q', value);

		loading = true;
		const response = await fetch(autocompleteURL);
		results = await response.json();

		if (results) {
			searchCache.set(value, results);
		}

		loading = false;
		canSearch = false;

		setTimeout(async () => {
			canSearch = true;

			const newValue = target.value;
			if (newValue !== value) {
				await getAutocompleteResults(target);
			}
		}, 1000);
	};

	const onSearchbarType = async (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		await getAutocompleteResults(target);
	};
</script>

<div class="flex searchbar-container">
	<div class="relative w-full">
		<input
			on:input={onSearchbarType}
			type="search"
			id="search-dropdown"
			class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
			placeholder="Search for tags, artists, users, and anything else on Dexbooru!"
			required
		/>
	</div>
</div>

{#if results}
	<OptionsDropdown {results} />
{/if}

{#if loading}
	<LoadingSpinner />
{/if}

<style>
	.searchbar-container {
		position: relative;
	}
</style>
