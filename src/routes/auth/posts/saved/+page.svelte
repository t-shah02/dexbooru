<script lang="ts">
	import EmptyContainerAlert from '$lib/components/EmptyContainerAlert.svelte';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import { getSavedPostIds } from '$lib/posts/saved';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let posts = data.posts;
	let postIds = data.savedPostIds;

	const userDestroy = authenticatedUser.subscribe((user) => {
		if (user) {
			posts = user.savedPosts;
			postIds = getSavedPostIds(posts, posts);
		}
	});

	onDestroy(() => {
		userDestroy();
	});
</script>

{#if posts.length}
	<PostGrid {posts} savedPosts={postIds} />
{:else}
	<EmptyContainerAlert
		heading={'No saved posts :\\'}
		subHeading={'Once you start saving posts, they will appear on this page'}
		redirectLink={'/auth/posts/created'}
		redirectLinkText={'Check out your upload posts'}
	/>
{/if}
