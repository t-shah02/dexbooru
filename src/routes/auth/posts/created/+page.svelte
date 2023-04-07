<script lang="ts">
	import EmptyContainerAlert from '$lib/components/EmptyContainerAlert.svelte';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import { getSavedPostIds } from '$lib/posts/saved';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let posts = data.posts;
	let savedPostIds = data.savedPostIds;

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
	<PostGrid {posts} savedPosts={savedPostIds} marginBottom={150} editMode={true} />
{:else}
	<EmptyContainerAlert
		heading={'No uploaded posts :\\'}
		subHeading={'Once you start uploading posts, they will appear on this page'}
		redirectLink={'/auth/posts/saved'}
		redirectLinkText={'Check out your saved posts'}
	/>
{/if}
