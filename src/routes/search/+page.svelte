<script lang="ts">
	import queryResults from '$lib/stores/searchStores';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import SearchInput from '$lib/components/search/SearchInput.svelte';
	import { navbarData } from '$lib/stores/components';
	import PostSearcher, { getAtrributeCounts } from '$lib/query/autocomplete';
	import { onDestroy } from 'svelte';
	import LoadingSpinner from '$lib/components/svgs/LoadingSpinner.svelte';
	import { getSavedPostIds } from '$lib/posts/saved';
	import { authenticatedUser } from '$lib/stores/userStores';
	import MessageToast from '$lib/components/MessageToast.svelte';
	import Attributes from '$lib/components/search/Attributes.svelte';
	import type { Post } from '$lib/interfaces/posts';

	let searchResultsSavedPostIds: string[] = [];
	let loading = false;
	let morePostsLoading = false;
	let noMorePosts = false;
	let query = '';
	let queryTags: string[] = [];
	let queryArtists: string[] = [];
	let queryUploaders: string[] = [];

	const postSearcher = new PostSearcher(queryResults);

	const queryResultDestroy = queryResults.subscribe((queryData) => {
		searchResultsSavedPostIds = getSavedPostIds(
			queryData.results,
			$authenticatedUser?.savedPosts || []
		);

		const [newQueryTags, newQueryArtists, newQueryUploaders] = getAtrributeCounts(
			queryData.results
		);
		queryTags = newQueryTags;
		queryArtists = newQueryArtists;
		queryUploaders = newQueryUploaders;
	});

	onDestroy(() => {
		queryResults.set({
			results: [],
			averageTimeTaken: 0,
			allTimesTaken: [],
			currentPage: 0
		});

		queryResultDestroy();
	});
</script>

<svelte:head>
	<title>Search {query.length ? `- ${query}` : ''}</title>
</svelte:head>

<div style="top: {$navbarData.height + 25}px; " class="fixed w-full z-40">
	<SearchInput bind:query bind:loading bind:searchResultsSavedPostIds {postSearcher} />
</div>

<div class="flex flex-col">
	{#if loading}
		<LoadingSpinner />
	{/if}
	{#if $queryResults.results.length}
		<section class="flex flex-wrap justify-center space-x-3">
			<div style="margin-top: {$navbarData.height + 100}px">
				<Attributes tags={queryTags} artists={queryArtists} uploaders={queryUploaders} />
			</div>
			<div class="w-3/4 flex flex-col justify-center">
				<h2 class="text-4xl font-extrabold dark:text-white text-center mt-44">
					Found {$queryResults.results.length} posts for {query} in {Math.ceil(
						$queryResults.averageTimeTaken
					)}ms
				</h2>

				<PostGrid
					marginTop={10}
					marginBottom={50}
					posts={$queryResults.results}
					savedPosts={searchResultsSavedPostIds}
					showSortbar={false}
				/>
				{#if !noMorePosts}
					{#if !morePostsLoading}
						<button
							on:click={async () => {
								morePostsLoading = true;
								const morePosts = await postSearcher.fetchMorePosts(query);
								if (!morePosts) noMorePosts = true;
								morePostsLoading = false;
							}}
							type="button"
							class="mb-20 w-1/4 ml-auto mr-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							>Load more results</button
						>
					{:else}
						<div class="mb-20 m-auto">
							<LoadingSpinner />
						</div>
					{/if}
				{:else}
					<div class="mb-20 m-auto">
						<div
							class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
							role="alert"
						>
							<span class="font-medium">Loaded everything!</span> There is no more posts to load anymore
						</div>
					</div>
				{/if}
			</div>
		</section>
	{/if}
</div>
