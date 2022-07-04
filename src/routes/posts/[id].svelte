<script context="module">
	
	

	export async function load({ fetch, params, session }) {
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

			const auth = session.authenticated;
			let username = "";
			let pfp = "";
			
			if (auth) {
				username = session.username;
				pfp = session.pfp;
			}
			
			if (nsfw) {
				let urlBlurred = `${url}?tr=bl-25`;
				return { props: {url, tags, uploader, id, artist,width,height,imageAlt,nsfw, urlBlurred,username,pfp}};
			}
			
			return { props: {url, tags, uploader, id, artist,width,height,imageAlt,nsfw,username,pfp}};
		}
		return { props: { post: false, postID: postID } };
	}
</script>

<script>

	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { darkCardColor, darkBodyColor, lightModeColor} from "../../colors.js";
	import {darkmode} from "../../stores.js";
	import Comment from "../../components/Comment.svelte";
import { dataset_dev } from 'svelte/internal';

	
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
	export let username;
	export let pfp;


	const maxCommentCharLength = 500;

	let commentText = "";
	let commentTooLong = false;
	let comments = [];

	let postNotFound = false;
	if (post === false) {
		postNotFound = true;
	}
	
	
	let clientWidth;
	let postImage;
	


	onMount(() => {
		postImage = document.querySelector("#post-img");
		clientWidth = document.documentElement.clientWidth;
		if (width / clientWidth >= 0.85) {
			postImage.style.width = "75%";
		}
		postImage.style.display = "block";
		
		window.addEventListener("resize",() => {
			clientWidth = document.documentElement.clientWidth;
				if (clientWidth < 1024) {
					postImage.style.width = "75%";
				}
				else {
					postImage.style.width = "50%";
				}
		});
	});
	
	
	
	async function submitComment() {
		commentTooLong = commentText.length >= maxCommentCharLength ? true : false;
		if (!commentTooLong) {
			comments = [commentText,...comments];
			
			const body = {id, commentText, author : username};
			const response = await fetch("/api/comment",{
				method : "POST",
				body : JSON.stringify(body)
			});
			
				
		}
	}

	function onCommentType() {
		commentTooLong = commentText.length >= maxCommentCharLength ? true : false;
	}
	

	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];

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
	<meta property="og:description" content="Artist: {artist.length ? artist : 'Unknown'} | Uploader: {uploader}">
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
			<img id="post-img" on:click={invertBlur} src={isBlurred ? urlBlurred : url} alt={imageAlt} />		
		</div>
	{/if}
	</div>
	{#if username.length}
		<div class="comment-make-container">
			<h1 style="color : {$darkmode ? "white" : "black"}">Make a comment under {username}:</h1>
			{#if clientWidth < 500}
				<textarea maxlength="{maxCommentCharLength}" bind:value={commentText} class="textarea {commentTooLong ? "is-danger" : "is-primary"}" rows="8" on:input={onCommentType} placeholder="Leave a comment here!"></textarea>
			{:else}
				<textarea maxlength="{maxCommentCharLength}" bind:value={commentText} class="textarea {commentTooLong ? "is-danger" : "is-primary"}" rows="5" on:input={onCommentType} placeholder="Leave a comment here!"></textarea>
			{/if}
			<h3><strong style="color : {commentText.length === maxCommentCharLength ? "red" : "lightgreen"}">{commentText.length}/{maxCommentCharLength}</strong></h3>
			<button on:click={submitComment} class="button is-info">Comment</button>
		</div>
		
	{/if}

	<div class="commentCard" style="background-color : {$darkmode ? darkCardColor : lightModeColor}">
		<div class="comments" style="color: {$darkmode ? "white" : "black"}">
			<h2>COMMENTS</h2>
			<hr>
			{#each comments as comment}
				<Comment text={comment}></Comment>
			{/each}
		</div>
	</div>
</div>
<style>
	
	#id {
		min-height : 100vh;
		padding-top: 25px;
		padding-bottom: 50px;
		transition: background-color 200ms ease-in-out;
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

	.comment-make-container {
		display : block;
		margin-left : auto;
		margin-right : auto;
		margin-bottom : 50px;
		width : 85%;
	}

	.comment-make-container h3 {
		text-align : right;
	}

	.commentCard {
		display : block;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		border-radius : 10px;
		overflow : hidden;
		margin-bottom : 20px;
	}

	.comments {
		height : 200px;
		overflow-y : scroll;
	}

	.button {
		margin-top : 1px;
	}

	.textarea {
		resize : none;
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
		display : none;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20px;
		margin-top : 0px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		box-sizing : border-box;
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
