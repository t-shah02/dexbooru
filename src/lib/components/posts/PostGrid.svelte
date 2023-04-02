<script lang="ts">
	import type { Post } from '$lib/interfaces/posts';
	import PostCard from './PostCard.svelte';
	import { flip } from 'svelte/animate';
	import ControlBar from './ControlBar.svelte';

	export let posts: Post[] = [];
	export let savedPosts: string[];
	export let marginTop: number = 150;
	export let marginBottom: number = 100;
	export let editMode: boolean = false;

	const POST_CARD_TRANSITION_DURATION = 500;
</script>

<ControlBar bind:posts />
<div
	style="margin-top: {marginTop}px; margin-bottom: {marginBottom}px"
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mx-auto post-grid"
>
	{#each posts as post (post)}
		<div animate:flip={{ duration: POST_CARD_TRANSITION_DURATION }} class="break-inside-avoid m-2">
			<PostCard {editMode} postRef={post} {...post} isSaved={savedPosts.includes(post.postId)} />
		</div>
	{/each}
</div>
