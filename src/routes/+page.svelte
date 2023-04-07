<script lang="ts">
	import type { PageData } from './$types';
	import noPostsMascot from '$lib/assets/no_posts_mascot.png';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';
	import PostPaginator from '$lib/components/pages/PostPaginator.svelte';
	import EmptyContainerAlert from '$lib/components/EmptyContainerAlert.svelte';
	import { getSavedPostIds } from '$lib/posts/saved';
	import { authenticatedUser } from '$lib/stores/userStores';

	export let data: PageData;

	const { posts, foundPosts, pageNumber } = data;

	const savedPosts = $authenticatedUser
		? getSavedPostIds(posts, $authenticatedUser.savedPosts)
		: [];

	const uniqueTags = new Set<string>();
	const uniqueArtists = new Set<string>();
	posts.forEach((post) => {
		post.tags.forEach((tag) => uniqueTags.add(tag));
		post.artists.forEach((artist) => uniqueArtists.add(artist));
	});

	const allTags = Array.from(uniqueTags).join(', ');
	const allArtists = Array.from(uniqueArtists).join(', ');
</script>

<svelte:head>
	<title>Recent posts - Page {pageNumber + 1}</title>
	<meta name="description" content="Page # {pageNumber + 1}, with {posts.length} on this page." />
	<meta property="og:title" content="Dexbooru - Recent Posts on page {pageNumber + 1}" />
	<meta property="og:description" content={`Tags: ${allTags} \n Artists: ${allArtists}`} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="/" />
</svelte:head>

{#if foundPosts}
	<div class="mt-20">
		<PostPaginator {pageNumber} />
		<PostGrid marginTop={50} marginBottom={150} {posts} {savedPosts} />
	</div>
{:else}
	<EmptyContainerAlert
		heading={`No posts found on page ${pageNumber + 1} :\\`}
		subHeading={'Recent posts will get populated here, once the page fills up'}
		redirectLink={'/'}
		redirectLinkText={'Go home'}
	/>
{/if}
