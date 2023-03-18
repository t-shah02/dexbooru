<script lang="ts">
	import type { PageServerData } from './$types';
	import PostGrid from '$lib/components/posts/PostGrid.svelte';

	export let data: PageServerData;

	const { posts, userQuery } = data;
</script>

<svelte:head>
	<title>Search - {userQuery}</title>
</svelte:head>

<h1 class="format flex items-center text-5xl font-extrabold dark:text-white mt-20">
	Search Query<span
		class="bg-blue-100 text-blue-800 text-2xl font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2"
		>{posts.length} results</span
	>
</h1>

<h2 class="format flex items-center text-4xl font-bold dark:text-white">
	{userQuery}
</h2>

<PostGrid marginTop={50} {posts} />
