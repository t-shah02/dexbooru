<script lang="ts">
	import EmptyContainerAlert from '$lib/components/EmptyContainerAlert.svelte';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import { getSavedPostIds } from '$lib/posts/saved';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/interfaces/posts';
	import LoadingSpinner from '$lib/components/svgs/LoadingSpinner.svelte';

	export let data: PageData;

	let posts: Post[] = [];
	let savedPostIds: string[] = [];
	let noPostsFound = false;
	let loading = false;

	const fetchPosts = async () => {
		if ($authenticatedUser) {
			const postURL = new URL(
				`/api/posts/users/${$authenticatedUser.username}`,
				window.location.origin
			);
			postURL.searchParams.append('page', `${$authenticatedUser.postPage}`);

			loading = true;
			const response = await fetch(postURL);
			loading = false;

			if (response.ok) {
				const paginatedPosts: Post[] = await response.json();
				paginatedPosts.forEach((post) => (post.date = new Date(post.date)));

				authenticatedUser.update((user) => {
					if (user) {
						paginatedPosts.forEach((post) => user.posts.push(post));
						user.postPage++;
					}

					return user;
				});
			}
		}
	};

	onMount(async () => {
		if ($authenticatedUser && $authenticatedUser.postPage === 0) {
			await fetchPosts();
			if (!$authenticatedUser.posts.length) {
				noPostsFound = true;
			}
		}
	});

	const userDestroy = authenticatedUser.subscribe((user) => {
		if (user) {
			posts = user.posts;
			savedPostIds = getSavedPostIds(posts, user.savedPosts);
		}
	});

	onDestroy(userDestroy);
</script>

<svelte:head>
	<title>Your posts</title>
</svelte:head>

{#if posts.length}
	<div class="mb-20">
		<PostGrid
			{posts}
			savedPosts={savedPostIds}
			marginBottom={25}
			editMode={true}
			showSortbar={false}
		/>
		{#if !loading}
			<button
				on:click={fetchPosts}
				type="button"
				class="m-auto block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
				>Load more posts</button
			>
		{:else}
			<div class="flex justify-center">
				<LoadingSpinner />
			</div>
		{/if}
	</div>
{/if}

{#if loading}
	<LoadingSpinner />
{/if}

{#if noPostsFound}
	<EmptyContainerAlert
		heading={'No uploaded posts :\\'}
		subHeading={'Once you start uploading posts, they will appear on this page'}
		redirectLink={'/auth/posts/saved'}
		redirectLinkText={'Check out your saved posts'}
	/>
{/if}
