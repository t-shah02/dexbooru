<script lang="ts">
	import '$lib/assets/styles/smui/layoutgrid.css';
	import type { PageData } from './$types';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import PostCard from '$lib/components/PostCard.svelte';
	import noPostsMascot from '$lib/assets/no_posts_mascot.png';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import { flip } from 'svelte/animate';

	export let data: PageData;
	const foundPosts = data.foundPosts;

	let posts = data.posts;
	let postFilters = data.filters;
	const pageNumber = data.pageNumber;

	const sortDirection = true;
	

	const sortPostsByFilter = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		const sortDirection = target.checked;
		const filterOption = target.value;

		console.log(sortDirection, filterOption);

		switch (filterOption) {
			case 'Date':
				return sortDirection ? postFilters.date.increasing : postFilters.date.decreasing;
			case 'Uploader':
				return sortDirection ? postFilters.uploader.increasing : postFilters.uploader.decreasing;
			case 'Views':
				return sortDirection ? postFilters.views.increasing : postFilters.views.decreasing;
			default:
				return data.posts;
		}
	};
</script>

<div>
	{#if foundPosts}
		<div class="mt-20 flex flex-col">
			<label for="sortFilter" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Sort by</label
			>
			<select
				on:change={(event) => (posts = sortPostsByFilter(event))}
				id="sortFilter"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			>
				<option>Date</option>
				<option>Uploader</option>
				<option>Views</option>
			</select>
			<label class="mt-2 relative inline-flex items-center cursor-pointer">
				<input
					on:change={(event) => (posts = sortPostsByFilter(event))}
					type="checkbox"
					checked
					class="sr-only peer"
				/>
				<div
					class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				/>
				<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Descending</span>
			</label>
		</div>

		<LayoutGrid align="right">
			{#each posts as post (post)}
				<Cell>
					<PostCard {...post} />
				</Cell>
			{/each}
		</LayoutGrid>

		<div class="navigation-controls">
			{#if pageNumber - 1 >= 0}
				<a data-sveltekit-reload href="/?page={pageNumber - 1}">
					<button class="button transparent border">
						<i>chevron_left</i>
					</button>
				</a>
			{/if}
			<a data-sveltekit-reload href="/?page={pageNumber + 1}">
				<button class="button transparent border">
					<i>chevron_right</i>
				</button>
			</a>
		</div>
	{:else}
		<div class="no-posts-container">
			<h1 class="no-posts-message center-align">No posts found on page {pageNumber + 1} :((</h1>
			<img src={noPostsMascot} alt="no posts found mascot" />
			<br />
			<a data-sveltekit-reload href="/?page={pageNumber - 1}">
				<button class="button transparent border">
					<i>chevron_left</i>
				</button>
			</a>
		</div>
	{/if}
</div>

<style lang="postcss">
	.all-controls {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.switch {
		margin-left: 10px;
		margin-bottom: 30px;
	}

	.no-posts-message {
		font-size: 20px;
	}

	.no-posts-container {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%, 20%);
	}

	.field {
		width: 200px;
	}

	.navigation-controls {
		height: 100px;
		margin: 25px;
		display: flex;
	}

	.button {
		margin-bottom: 100px;
	}

	.navigation-controls > a {
		margin-left: auto;
		margin-right: auto;
	}
</style>
