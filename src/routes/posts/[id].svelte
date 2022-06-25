<script context="module">
	export async function load({ fetch, params }) {
		const postID = params.id;
		const response = await fetch(`/api/posts/search/${postID}`);
		const post = await response.json();
		if (post) {
			let url = post.imageURL;
			let tags = post.tags;
			let uploader = post.uploader;
			let id = post.postID;
			let artist = post.artist;
			let width = post.width;
			let height = post.height;
			let imageAlt = tags.join(", ");
			

			return { props: {url, tags, uploader, id, artist,width,height,imageAlt}};
		}
		return { props: { post: false, postID: postID } };
	}
</script>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	export let post;
	export let postID;
	export let url;
	export let tags;
	export let uploader;
	export let id;
	export let artist;
	export let width;
	export let height;
	export let imageAlt;
	
	let postNotFound = false;
	if (post === false) {
		postNotFound = true;
	}
	
	let clientWidth;

	onMount(() => {
		clientWidth = document.documentElement.clientWidth;
	});

	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];

	let postImage;

	let isBlurred = true;

	function toggleBlur() {
		isBlurred = !isBlurred;
		if (isBlurred) {
			postImage.style.filter = 'blur(13px)';
			postImage.style.webKitFilter = 'blur(13px)';
		} else {
			postImage.style.filter = '';
			postImage.style.webKitFilter = '';
		}
	}
</script>

<svelte:head>
	{#if !postNotFound}
		<title>{tags.join(', ')} - Dexbooru</title>
	{:else}
		<title>Not found - Dexbooru</title>
	{/if}
</svelte:head>

{#if postNotFound}
	<article class="message is-danger">
		<div class="message-header">
			<p>We couldn't find anything :((</p>
			<button class="delete" aria-label="delete" />
		</div>
		<div class="message-body">
			A post with the ID: {postID} has either been removed or has never existed. Happy browsing for more
			awesome weeb content.
		</div>
	</article>
{:else}
	<div in:slide out:slide>
		<div class="card">
			<div class="card-content">
				<div class="content">
					Uploader: {uploader}
					<br />
					<hr />
					Artist: {artist.length ? artist : 'Unknown'}
					<br />
					<hr />
					Dimensions: {width}px by {height}px
				</div>
			</div>
		</div>

		<div class="tag-container">
			{#each tags as tag}
				<a class="tag-link" href="https://google.ca"
					><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">{tag}</span></a
				>
			{/each}
		</div>

		<a target="_blank" class="preview-link" href={url}>Preview the full image</a>

		{#if width / clientWidth >= 0.85}
			<img
				bind:this={postImage}
				on:click={toggleBlur}
				src={url}
				style="transform : scale(0.8);"
				alt={imageAlt}
			/>
		{:else}
			<img bind:this={postImage} on:click={toggleBlur} src={url} alt={imageAlt} />
		{/if}
	</div>
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

	.post-information {
		margin-top: 75px;
	}

	.image-container {
		margin: 5px;
	}

	.tag-link {
		text-decoration: none;
		transition: transform 150ms ease-in-out;
	}

	.tag-link:hover {
		transform: scale(1.03);
	}

	.tag-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 20px;
	}

	.tag {
		margin: 10px;
	}

	.card {
		margin-top: 100px;
		width: 50%;
		display: block;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	.preview-link {
		display: inline-block;
		margin-bottom: 20px;
	}

	img {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50px;
		margin-top : 0px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	}

	img:hover {
		cursor: pointer;
	}

	div {
		text-align: center;
	}
</style>
