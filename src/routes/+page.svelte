<script lang="ts">
	import PostCard from "$lib/components/PostCard.svelte";
	import type { PageData } from './$types';

	export let data: PageData;

	const posts = data.posts;	

	

</script>

<style>
	.post-grid div {
		background-repeat: no-repeat;
		background-size: contain;
		width: 100%;
		height: auto;
		padding-top: 70%;
	}

	.post-grid {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		margin-bottom: 100px;
	}
</style>
