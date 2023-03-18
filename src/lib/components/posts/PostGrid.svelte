<script lang="ts">
	import type { Post } from '$lib/interfaces/posts';
	import PostCard from './PostCard.svelte';
	import { flip } from 'svelte/animate';
	import ControlBar from './ControlBar.svelte';

	export let posts: Post[] = [];
	export let marginTop: number = 150;

	const POST_CARD_TRANSITION_DURATION = 500;
</script>

<ControlBar bind:posts />
<div
	style="margin-top: {marginTop}px"
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mx-auto mb-20 post-grid"
>
	{#each posts as post (post)}
		<div animate:flip={{ duration: POST_CARD_TRANSITION_DURATION }} class="break-inside-avoid m-2">
			<PostCard {...post} />
		</div>
	{/each}
</div>
