<script lang="ts">
	import '$lib/assets/styles/smui/layoutgrid.css';
	import type { PageData } from './$types';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import PostCard from '$lib/components/PostCard.svelte';
	import noPostsMascot from '$lib/assets/no_posts_mascot.png';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	

	export let data: PageData;
	const foundPosts = data.foundPosts;

	let posts = data.posts;
	let postArrangements = data.arrangements;
	const pageNumber = data.pageNumber;

	type ArrangementOption = 'Date' | 'Uploader' | 'Views';

	let sortDirection: boolean;
	let arrangementOption: ArrangementOption = 'Date';

	const onArrangementOptionChange = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		arrangementOption = target.value as ArrangementOption;

		posts = sortPostsByOption(arrangementOption, sortDirection);
	};

	const onSortDirectionChange = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		sortDirection = target.checked;

		posts = sortPostsByOption(arrangementOption, sortDirection);
	};

	const sortPostsByOption = (option: ArrangementOption, direction: boolean) => {
		switch (option) {
			case 'Date':
				return direction ? postArrangements.date.increasing : postArrangements.date.decreasing;
			case 'Uploader':
				return direction
					? postArrangements.uploader.increasing
					: postArrangements.uploader.decreasing;
			case 'Views':
				return direction ? postArrangements.views.increasing : postArrangements.views.decreasing;
			default:
				return data.posts;
		}
	};
</script>

<div>
	{#if foundPosts}
		<div class="mt-20 flex flex-col">
			<label for="sortProperty" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Sort by</label
			>
			<select
				on:change={onArrangementOptionChange}
				id="sortProperty"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			>
				<option>Date</option>
				<option>Uploader</option>
				<option>Views</option>
			</select>
			<label class="mt-2 relative inline-flex items-center cursor-pointer">
				<input on:change={onSortDirectionChange} type="checkbox" class="sr-only peer" />
				<div
					class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				/>
				<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Increasing</span>
			</label>
		</div>

		<LayoutGrid align="right">
			{#each posts as post (post)}
				<Cell>
					<PostCard {...post} />
				</Cell>
			{/each}
		</LayoutGrid>

		<div class="flex justify-center mt-5 mb-5">
			{#if pageNumber - 1 >= 0}
				<a
					data-sveltekit-reload
					href="/?page={pageNumber - 1}"
					class="inline-flex items-center px-4 py-2 mr-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</a>
			{/if}
			<a
				data-sveltekit-reload
				href="/?page={pageNumber + 1}"
				class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
			>
				<svg
					aria-hidden="true"
					class="w-5 h-5 ml-2"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/></svg
				>
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

<style>
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

	.button {
		margin-bottom: 100px;
	}

	.navigation-controls > a {
		margin-left: auto;
		margin-right: auto;
	}
</style>
