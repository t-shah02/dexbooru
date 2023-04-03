<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { PageData } from './$types';
	import { addPost } from '$lib/posts/history';
	import { onMount } from 'svelte';
	import InfoCard from '$lib/components/posts/InfoCard.svelte';
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

	onMount(() => {
		addPost(postId);
	});
</script>

<div class="flex flex-col space-y-5 mt-20 mb-20 post-container">
	<InfoCard {views} {date} {authorName} {authorProfilePictureURL} {postId} />
	<div class="flex flex-wrap justify-center space-x-5">
		{#each images as image}
			<img class="h-auto" src={image} alt={tags.join(',')} />
		{/each}
	</div>
	<Chips {tags} {artists} />

	<Comments postID={postId} comments={comments || []} />
</div>
