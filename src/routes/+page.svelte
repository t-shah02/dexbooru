<script lang="ts">
	import '$lib/assets/styles/smui/layoutgrid.css';
	import type { PageData } from './$types';
	import noPostsMascot from '$lib/assets/no_posts_mascot.png';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import Sortbar from '$lib/components/posts/ControlBar.svelte';
	import PostPaginator from '$lib/components/pages/PostPaginator.svelte';

	export let data: PageData;
	const foundPosts = data.foundPosts;

	let posts = data.posts;
	const pageNumber = data.pageNumber;
</script>

<svelte:head>
	<title>Home - Page {pageNumber + 1}</title>
</svelte:head>

{#if foundPosts}
	<div class="mt-20">
		<PostPaginator {pageNumber} />
		<PostGrid marginTop={50} {posts} />
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
