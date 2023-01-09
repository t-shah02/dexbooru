<script lang="ts">
	import PostCard from '$lib/components/PostCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const posts = data.posts;

	

</script>

<div class="main" id="main">
	{#each posts as post}
		<PostCard {...post} />
	{/each}
</div>

<style>
	.main {
		max-width: 2400px;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		margin-bottom: 100px;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		justify-content: center;
	}
</style>
