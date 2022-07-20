<script context="module">
	export async function load({ fetch, url }) {
		const page = url.searchParams.get('page') || 0;
		const response = await fetch(`/api/posts/recent?page=${page}`);
		const body = await response.json();
		const posts = body.allPosts;
		const numPages = body.totalPages;
		

		if (parseInt(page) >= 0 && parseInt(page) < numPages) {
			return { props: { posts: posts, numPages: numPages, page : page } };
		}
		
		return {props : {invalidPage : true, page : page}};
	}
</script>

<script>
	import PostCard from '../components/PostCard.svelte';
	import {slide} from "svelte/transition";
	import {darkmode} from "../stores.js";
	import {onMount} from "svelte";
	import { darkBodyColor, lightModeColor} from "../colors.js"
	import Glide from '@glidejs/glide';
	

	export let posts;
	export let numPages;
    export let page; 
	export let invalidPage;


	onMount(() => {
		const sliders = document.querySelectorAll('.glide');

		for (let i = 0; i < sliders.length; i++) {
  			const glide = new Glide(sliders[i], {
				type: 'carousel',
 				startAt: 0,
  				perView: 1
			});
			glide.mount();
		}
	}
	);

	const redirectToPage = (page) => window.location.replace(`/?page=${page}`);

	
</script>

<svelte:head>
	<title>Hot posts - Dexbooru</title>
</svelte:head>

<body style="background-color : {$darkmode ? darkBodyColor : lightModeColor}">
	{#if !invalidPage}
		<h1 style="color : {$darkmode ? `white` : "black"}" in:slide out:slide>Recent posts</h1>

		<div in:slide out:slide class="post-container">
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

		<nav in:slide out:slide class="pagination is-centered" role="navigation" aria-label="pagination">
			
			<ul class="pagination-list">
				{#if parseInt(page)-1 >= 0}
					<a style="color : {$darkmode ? `white` : "black"}" on:click={() => window.location.replace(`/?page=${parseInt(page)-1}`)} class="pagination-previous"><i class="fa-solid fa-angle-left"></i></a>
				{/if}
				{#each Array.from(Array(numPages).keys()) as pageNumber}
					{#if pageNumber === parseInt(page)}
						<li><a  style="color : {$darkmode ? `white` : "black"}" on:click={() => window.location.replace(`/?page=${pageNumber}`)} class="pagination-link is-current" aria-label="Goto page {pageNumber+1}">{pageNumber+1}</a></li>
					{:else}
						<li><a  style="color : {$darkmode ? `white` : "black"}" on:click={() => window.location.replace(`/?page=${pageNumber}`)} class="pagination-link" aria-label="Goto page {pageNumber+1}">{pageNumber+1}</a></li>
					{/if}
				{/each}
				{#if parseInt(page) + 1 < numPages}
					<a  style="color : {$darkmode ? `white` : "black"}" on:click={() => window.location.replace(`/?page=${parseInt(page)+1}`)} class="pagination-next"><i class="fa-solid fa-angle-right"></i></a>
				{/if}
			</ul>
		</nav>

	{:else}
		<article class="message is-danger">
			<div class="message-header">
				<p>We couldn't find anything :((</p>
				<button class="delete" aria-label="delete" />
			</div>
			<div class="message-body">
				No more content to show for page # {parseInt(page)}
			</div>
		</article>
	{/if}
</body>

<style>

	body {
		transition : background-color 200ms ease-in-out;
	}

	article {
			display: block;
			margin-top: 200px;
			margin-left: auto;
			margin-right: auto;
			text-align: center;
			width: 85%;
	}

	.message-header p {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

    .pagination {
		margin-bottom : 50px;		
    }


	.pagination-list {
		display: flex;
	}

	* {
		overflow-x: hidden;
	}

	h1 {
		margin-top: 75px;
		text-align: center;
	}

	.post-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 20px;
	}

</style>
