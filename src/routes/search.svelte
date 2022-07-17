<script context="module">
	import { parseQuery } from '../util/queries.js';
	export async function load({ url, fetch }) {
		const query = url.searchParams.get('query') || "";
	

		if (!query.length) {
			return {
				props: { query }
			};
		}

		const parsedQuery = parseQuery(query);
		
		const body = {
			criteria: parsedQuery
		};

		const response = await fetch('/api/search', {
			method: 'POST',
			body: JSON.stringify(body)
		});

		const data = await response.json();
		const { posts } = data;
		

		return {
			props: { query: parsedQuery, posts }
		};
	}
</script>

<script>
	import { darkBodyColor, lightModeColor } from '../colors';
	import { darkmode } from '../stores';
	import PostCard from '../components/PostCard.svelte';

	export let query;
	export let posts = [];
</script>

<div style="background-color : {$darkmode ? darkBodyColor : lightModeColor}" id="search">
	<h1 style="color : {$darkmode ? "white" : "black"}">Searched for: {query}</h1>
	<div class="results-container">
		{#each posts as post}
			<PostCard
				postID={post.postID}
				tags={post.tags}
				uploadDate={post.uploadDate.split(',')[0]}
				uploader={post.uploader}
				postImages={post.postImages}
				artist={post.artist}
			/>
		{/each}
	</div>
</div>

<style>
	#search {
		min-height: 100vh;
		padding-top: 25px;
		padding-bottom: 50px;
		transition: background-color 200ms ease-in-out;
	}

	.results-container {
		display :  flex;
		justify-content: center;
		flex-wrap : wrap;
	}

	h1 {
		margin-top: 50px;
		text-align: center;
	}
</style>
