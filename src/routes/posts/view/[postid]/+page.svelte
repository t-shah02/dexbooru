<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { PageData } from './$types';
	import { addPost } from '$lib/posts/history';
	import { onMount } from 'svelte';
	import PostInfoCard from '$lib/components/posts/InfoCard.svelte';
	import Chips from '$lib/components/posts/Chips.svelte';
	import Comments from '$lib/components/comments/Comments.svelte';

	export let form: FormData;

	export let data: PageData;
	const post = data.post;

	const postId = post.postId;
	const tags = post.tags;
	const artists = post.artists;
	const images = post.images;
	const authorName = post.authorName;
	const authorProfilePictureURL = post.authorProfileUrl;
	const date = prettifyDate(post.date);
	const views = post.views;
	const comments = post.comments;
	const title = post.title || '';

	onMount(() => {
		addPost(postId);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta property="og:type" content="website" />
	<meta
		property="og:description"
		content="Uploaded by {authorName} at {date}, with {views} view(s)"
	/>
	<meta property="og:url" content="/posts/view/{postId}" />
	<meta property="og:image" content={images[0]} />
</svelte:head>

<div class="flex flex-col space-y-5 mt-20 mb-20 post-container">
	<PostInfoCard {views} {date} {authorName} {authorProfilePictureURL} {postId} />
	<div class="flex flex-wrap justify-center space-x-5">
		{#each images as image}
			<img class="h-auto" src={image} alt={tags.join(',')} />
		{/each}
	</div>
	<Chips {tags} {artists} />

	<Comments postID={postId} comments={comments || []} />
</div>

<style>
	.post-container {
		width: 100%;
	}
</style>
