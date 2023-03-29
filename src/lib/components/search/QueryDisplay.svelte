<script lang="ts">
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { search } from '$lib/stores/searchStores';
	import { slide } from 'svelte/transition';
	import Cross from '../svgs/Cross.svelte';

	const deleteTagOrArtist = (event: FormEventHandler<HTMLSpanElement>) => {
		const target = event.target as HTMLSpanElement;
		const { type, value } = target.dataset;

		if (type === 'artist') {
			$search.artists = $search.artists?.filter((artist) => artist !== value);
		} else {
			$search.tags = $search.tags?.filter((tag) => tag !== value);
		}

		search.set($search);
	};

	const resetStartDate = () => {
		$search.startDate = undefined;
		search.set($search);
	};

	const resetEndDate = () => {
		$search.endDate = undefined;
		search.set($search);
	};

	const resetExactDate = () => {
		$search.exactDate = undefined;
		search.set($search);
	};

	const resetUploader = () => {
		$search.uploader = '';
		search.set($search);
	};
</script>

<h2 class="text-4xl font-extrabold dark:text-white">Your search query:</h2>

<div class="overflow-y-scroll border p-4 flex flex-wrap space-x-2">
	{#if $search.tags && $search.tags.length}
		{#each $search.tags as tag (tag)}
			<button
				in:slide
				type="button"
				on:click={deleteTagOrArtist}
				data-type="tag"
				data-value={tag}
				class="flex space-x-2 text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900"
				>Tag: {tag} <Cross />
			</button>
		{/each}
	{/if}

	{#if $search.artists && $search.artists.length}
		{#each $search.artists as artist}
			<button
				in:slide
				type="button"
				on:click={deleteTagOrArtist}
				data-type="artist"
				data-value={artist}
				class="flex space-x-2 text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
				>Artist: {artist}
				<Cross />
			</button>
		{/each}
	{/if}

	{#if $search.uploader}
		<button
			in:slide
			on:click={() => ($search.uploader = '')}
			type="button"
			class="flex space-x-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
			>Uploader: {$search.uploader} <Cross /></button
		>
	{/if}

	{#if $search.startDate}
		<button
			in:slide
			on:click={resetStartDate}
			type="button"
			class="flex space-x-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>Start Date: {$search.startDate} <Cross /></button
		>
	{/if}

	{#if $search.endDate}
		<button
			in:slide
			on:click={resetEndDate}
			type="button"
			class="flex space-x-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>End Date: {$search.endDate} <Cross /></button
		>
	{/if}

	{#if $search.exactDate}
		<button
			in:slide
			on:click={resetExactDate}
			type="button"
			class="flex space-x-2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>Exact Date: {$search.exactDate} <Cross /></button
		>
	{/if}
</div>
