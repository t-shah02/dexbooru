<script context="module">
	export async function load({ fetch, params, session }) {
		const postID = params.id;
		const response = await fetch(`/api/posts/search/${postID}`);
		const post = await response.json();

		if (post) {
			let tags = post.tags;
			let uploader = post.uploader;
			let id = post.postID;
			let artist = post.artist;
			let images = post.postImages;
			let imageAlt = tags.join(', ');

			const auth = session.authenticated;
			let username = '';
			let pfp = '';

			if (auth) {
				username = session.username;
				pfp = session.pfp;
			}

			return { props: { tags, uploader, id, artist, images, imageAlt, username, pfp } };
		}
		return { props: { post: false, postID: postID } };
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { darkCardColor, darkBodyColor, lightModeColor } from '../../colors.js';
	import { darkmode } from '../../stores.js';
	import Comment from '../../components/Comment.svelte';

	export let post;
	export let postID;
	export let url;
	export let tags;
	export let uploader;
	export let id;
	export let artist;
	export let imageAlt;
	export let username;
	export let pfp;
	export let images;


	const maxCommentCharLength = 500;
	const postParts = images.length;

	let commentText = '';
	let commentTooLong = false;
	let comments = [];

	let { width, height, nsfw, imageURL } = images[0];
	
	

	let postNotFound = false;
	if (post === false) {
		postNotFound = true;
	}

	let clientWidth;
	let postImage;

	onMount(() => {
		postImage = document.querySelector('#post-img');
		clientWidth = document.documentElement.clientWidth;
		if (width / clientWidth >= 0.85) {
			postImage.style.width = '75%';
		}
		postImage.style.display = 'block';

		window.addEventListener('resize', () => {
			clientWidth = document.documentElement.clientWidth;
			if (clientWidth < 1024) {
				postImage.style.width = '75%';
			} else {
				postImage.style.width = '50%';
			}
		});
	});

	async function submitComment() {
		commentTooLong = commentText.length >= maxCommentCharLength ? true : false;
		if (!commentTooLong) {
			comments = [commentText, ...comments];

			const body = { id, commentText, author: username };
			const response = await fetch('/api/comment', {
				method: 'POST',
				body: JSON.stringify(body)
			});
		}
	}

	function onCommentType() {
		commentTooLong = commentText.length >= maxCommentCharLength ? true : false;
	}

	function swapImages(e) {
		const index = parseInt(e.target.dataset.index);
		imageURL = images[index].imageURL;
		nsfw = images[index].nsfw;
		width = images[index].width;
		height = images[index].height;
		
	}

	

	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];
</script>

<svelte:head>
	{#if !postNotFound}
		<title>{tags.join(', ')} - Dexbooru</title>
	{:else}
		<title>Not found - Dexbooru</title>
	{/if}
	<meta property="og:title" content="{tags.join(', ')} - Dexbooru" />
	<meta property="og:image" content={`${url}?test`} />
	<meta property="og:site_name" content="Dexbooru" />
	<meta
		property="og:description"
		content="Artist: {artist.length ? artist : 'Unknown'} | Uploader: {uploader}"
	/>
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
					A post with the ID: {postID} has either been removed or has never existed. Happy browsing for
					more awesome weeb content.
				</div>
			</article>
		{:else}
			<div in:slide out:slide>
				<div class="card" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
					<div class="card-content">
						<div class="content" style="color: {$darkmode ? 'white' : 'black'}">
							Uploader: {uploader}
							<br />
							<hr />
							Artist: {artist.length ? artist : 'Unknown'}
							<br />
							<hr />
							Dimensions: {width}px by {height}px
							{#if nsfw}
								<hr />
								<div class="notification is-danger">
									<strong>WARNING</strong>
									<br />
									This post has been marked as NSFW.
									<br />
									Click on the image to reveal the content.
								</div>
							{/if}
						</div>
					</div>
					
				</div>

				{#if postParts}
						<div class="post-parts-container">
							<h1 class="post-count" style="color : {$darkmode ? "white" : "black"}">This post has {postParts} images</h1>
							<div class="small-img-container">
								{#each Object.entries(images) as [index,image]}
									<div data-index={index} on:click={swapImages} class="small-post-img" style="background-image : url('{image.imageURL}')"></div>
								{/each}
							</div>
						</div>
				{/if}

				<div class="tag-container">
					{#each tags as tag}
						<a class="tag-link" href="https://google.ca"
							><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">{tag}</span></a
						>
					{/each}
				</div>

				<a target="_blank" class="preview-link" href={url}>Preview the full image</a>
				<img id="post-img" src={imageURL} alt={imageAlt} />
			</div>
		{/if}
	</div>
	{#if username.length}
		<div class="comment-make-container">
			<h1 style="color : {$darkmode ? 'white' : 'black'}">Make a comment under {username}:</h1>
			{#if clientWidth < 500}
				<textarea
					maxlength={maxCommentCharLength}
					bind:value={commentText}
					class="textarea {commentTooLong ? 'is-danger' : 'is-primary'}"
					rows="8"
					on:input={onCommentType}
					placeholder="Leave a comment here!"
				/>
			{:else}
				<textarea
					maxlength={maxCommentCharLength}
					bind:value={commentText}
					class="textarea {commentTooLong ? 'is-danger' : 'is-primary'}"
					rows="5"
					on:input={onCommentType}
					placeholder="Leave a comment here!"
				/>
			{/if}
			<h3>
				<strong style="color : {commentText.length === maxCommentCharLength ? 'red' : 'lightgreen'}"
					>{commentText.length}/{maxCommentCharLength}</strong
				>
			</h3>
			<button on:click={submitComment} class="button is-info">Comment</button>
		</div>
	{/if}

	<div class="commentCard" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
		<div class="comments" style="color: {$darkmode ? 'white' : 'black'}">
			<h2>COMMENTS</h2>
			<hr />
			{#each comments as comment}
				<Comment text={comment} />
			{/each}
		</div>
	</div>
</div>

<style>
	#id {
		min-height: 100vh;
		padding-top: 25px;
		padding-bottom: 50px;
		transition: background-color 200ms ease-in-out;
	}

	#postContent {
		height: max-content;
	}

	.post-count {
		font-size : 15px;
		margin-top : 10px;
	}

	

	.small-img-container {
		display : flex;
		width : 50%;
		margin-left : auto;
		margin-right : auto;
		margin-top : 10px;
		justify-content : center;
		flex-wrap : wrap;
		border : 1px solid green;
		border-radius : 5px;
	}

	.small-post-img {
		width : 150px;
		height : 150px;
		background-repeat : no-repeat;
		background-position : center;
		background-size : cover;
		margin : 20px;
		transition : transform 200ms ease-in-out;
	}

	.small-post-img:hover {
		cursor : pointer;
		transform : scale(1.04);
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
		overflow: hidden;
	}

	.comment-make-container {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50px;
		width: 85%;
	}

	.comment-make-container h3 {
		text-align: right;
	}

	.commentCard {
		display: block;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.comments {
		height: 200px;
		overflow-y: scroll;
	}

	.button {
		margin-top: 1px;
	}

	.textarea {
		resize: none;
	}

	.message {
		overflow: hidden;
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

	@media only screen and (max-width: 1023px) {
		.card {
			margin-top: 100px;
			width: 80%;
			display: block;
			margin-left: auto;
			margin-right: auto;
			text-align: center;
		}
	}

	.commentCard {
		margin-top: 10px;
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
		display: none;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20px;
		margin-top: 0px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
	}

	img:hover {
		cursor: pointer;
	}

	div {
		text-align: center;
	}

	h1 {
		font-size: clamp (18px, 6vw, 30px);
	}

	h2 {
		padding-top: 10px;
	}
</style>
