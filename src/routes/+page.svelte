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

	let filterOption: 'Date' | 'Uploader' | 'Views';

	const sortPostsByFilter = (event: FormEventHandler<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		const sortDirection = target.checked;

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
		<div class="control-section">
			<h6 class="center-align">Filter</h6>
			<div class="all-controls">
				<div class="field label suffix border small">
					<select
						bind:value={filterOption}
						on:change={(event) => (posts = sortPostsByFilter(event))}
					>
						<option>Date</option>
						<option>Uploader</option>
						<option>Views</option>
					</select>
					<label class="active">Sort by</label>
					<i>sort</i>
				</div>
				<label class="switch">
					<input on:change={(event) => (posts = sortPostsByFilter(event))} type="checkbox" />
					<span>
						<i>trending_down</i>
					</span>
				</label>
			</div>
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
