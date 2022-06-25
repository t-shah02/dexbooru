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
import { invalid } from 'moment';
	
	export let posts;
	export let numPages;
    export let page; 
	export let invalidPage;


	const redirectToPage = (page) => window.location.replace(`/?page=${page}`);

	
</script>

<svelte:head>
	<title>Hot posts - Dexbooru</title>
</svelte:head>


{#if !invalidPage}
	<h1 in:slide out:slide>Recent posts</h1>

	<div in:slide out:slide class="post-container">
		{#each posts as post}
			<PostCard
				postID={post.postID}
				tags={post.tags}
				uploadDate={post.uploadDate.split(',')[0]}
				uploader={post.uploader}
				imageSourceURL={post.imageURL}
			/>
		{/each}
	</div>

	<nav in:slide out:slide class="pagination is-centered" role="navigation" aria-label="pagination">
		
		<ul class="pagination-list">
			{#if parseInt(page)-1 >= 0}
				<a on:click={() => window.location.replace(`/?page=${parseInt(page)-1}`)} class="pagination-previous"><i class="fa-solid fa-angle-left"></i></a>
			{/if}
			{#each Array.from(Array(numPages).keys()) as pageNumber}
				{#if pageNumber === parseInt(page)}
					<li><a on:click={() => window.location.replace(`/?page=${pageNumber}`)} class="pagination-link is-current" aria-label="Goto page {pageNumber+1}">{pageNumber+1}</a></li>
				{:else}
					<li><a on:click={() => window.location.replace(`/?page=${pageNumber}`)} class="pagination-link" aria-label="Goto page {pageNumber+1}">{pageNumber+1}</a></li>
				{/if}
			{/each}
			{#if parseInt(page) + 1 < numPages}
				<a on:click={() => window.location.replace(`/?page=${parseInt(page)+1}`)} class="pagination-next"><i class="fa-solid fa-angle-right"></i></a>
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

<style>

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

	

	@keyframes -global-from-left {
		0% {
			transform: rotateX(0deg) translateX(-200vw) skewX(0deg);
		}

		100% {
			transform: rotateX(0deg) translateX(0) skewX(0deg);
		}
	}

	@keyframes -global-from-right {
		0% {
			transform: rotateX(0deg) translateX(200vw) skewX(0deg);
		}
		100% {
			transform: rotateX(0deg) translateX(0) skewX(0deg);
		}
	}

	@keyframes -global-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
