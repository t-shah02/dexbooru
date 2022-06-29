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
			let nsfw = post.nsfw || false;
			let imageAlt = tags.join(", ");
			
			if (nsfw) {
				let urlBlurred = `${url}?tr=bl-25`;
				return { props: {url, tags, uploader, id, artist,width,height,imageAlt,nsfw, urlBlurred}};
			}

			return { props: {url, tags, uploader, id, artist,width,height,imageAlt,nsfw}};
		}
		return { props: { post: false, postID: postID } };
	}
</script>

<script>
	import { onMount, onDestroy } from 'svelte';
	import { slide, fade } from 'svelte/transition';
	import { darkCardColor, darkBodyColor, lightModeColor} from "../../colors.js";
	import {darkmode} from "../../stores.js";
	import Comment from "../../components/Comment.svelte";

	
	export let post;
	export let postID;
	export let url;
	export let urlBlurred;
	export let tags;
	export let uploader;
	export let id;
	export let artist;
	export let width;
	export let height;
	export let imageAlt;
	export let nsfw;
	
	let postNotFound = false;
	if (post === false) {
		postNotFound = true;
	}
	

	let clientWidth;

	onMount(() => {
		clientWidth = document.documentElement.clientWidth;
	});
	
	let clientHeight;
	let scrollHeight;
	let paddingBottomContainer;
	let viewportHeight;

	// onMount(() => {
	// 	clientWidth = document.documentElement.clientWidth;
	// 	viewportHeight = window.innerHeight;
	// 	scrollHeight = document.body.scrollHeight;
	// 	clientHeight = document.getElementById('postContent').clientHeight;
	// 	//	paddingBottomContainer = scrollHeight - clientHeight;

	// 	if (clientHeight <= viewportHeight) {
	// 		console.log("straight");
	// 		paddingBottomContainer = viewportHeight - clientHeight;
	// 		console.log(viewportHeight);
	// 		console.log(clientHeight);
	// 	}
	// 	else {
	// 		console.log("gay");
	// 		console.log(viewportHeight);
	// 		console.log(clientHeight);	
	// 		paddingBottomContainer = 25;
	// 	}
	// 		// window.addEventListener("resize",() => {
	// 		// 	scrollHeight = document.body.scrollHeight;
	// 		// 	clientHeight = document.getElementById('postContent').clientHeight;
	// 		// 	paddingBottomContainer = Math.abs(scrollHeight - clientHeight);
	// 		// });


	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];

	let postImage;

	let isBlurred = nsfw || false;
	urlBlurred = urlBlurred || `${url}?test`;

	const invertBlur = () => isBlurred = !isBlurred;

	
</script>

<svelte:head>
	{#if !postNotFound}
		<title>{tags.join(', ')} - Dexbooru</title>
	{:else}
		<title>Not found - Dexbooru</title>
	{/if}
	<meta property="og:title" content="{tags.join(', ')} - Dexbooru">
	<meta property="og:image" content="{nsfw ? urlBlurred : `${url}?test`}">
	<meta property="og:site_name" content="Dexbooru">
	<meta property="og:description" content="Artist: {artist} | Uploader: {artist.length ? artist : 'Unknown'}">
</svelte:head>

<div id="id" style="background-color : {$darkmode ? darkBodyColor : lightModeColor}">
	<div id="postContent">
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
			<div class="card" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
				<div class="card-content">
					<div class="content" style="color: {$darkmode ? "white" : "black"}">
						Uploader: {uploader}
						<br />
						<hr />
						Artist: {artist.length ? artist : 'Unknown'}
						<br />
						<hr />
						Dimensions: {width}px by {height}px
						{#if nsfw}
							<hr/>
							<div class="notification is-danger">
								<strong>WARNING</strong>
								<br>
								This post has been marked as NSFW.
								<br>
								Click on the image to reveal the content.
							</div>
						{/if}
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
				{#if isBlurred}
					<img
						bind:this={postImage}
						src={urlBlurred}
						style="transform : scale(0.8);"
						alt={imageAlt}
						on:click={invertBlur}
					/>
				{:else}
					<img
						
						bind:this={postImage}
						src={`${url}?test`}
						style="transform : scale(0.8);"
						alt={imageAlt}
						on:click={invertBlur}
					/>
				{/if}
			{:else}
				{#if isBlurred}
					<img on:click={invertBlur} bind:this={postImage} src={urlBlurred} alt={imageAlt} />
				{:else}
					<img on:click={invertBlur} bind:this={postImage} src={`${url}?test`} alt={imageAlt} />
				{/if}
			{/if}
		</div>
	{/if}
	</div>
	<div class="commentCard" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
		<div class="comments" style="color: {$darkmode ? "white" : "black"}">
			<h2>COMMENTS</h2>
			<hr>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
			<Comment></Comment>
		</div>
	</div>
</div>
<style>
	
	#id {
		min-height : 100vh;
		padding-top: 25px;
		padding-bottom: 50px;
	}

	#postContent {
		height: max-content;
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
		overflow:hidden;
	}

	.message {
		overflow:hidden;
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

	.commentCard {
		margin-top: 50px;
		width: 80%;
		display: block;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
		padding-bottom: 10px;
	}

	.preview-link {
		display: inline-block;
		margin-bottom: 20px;
	}

	img {
		display : block;
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

	h2 {
		padding-top: 10px;
	}
</style>
