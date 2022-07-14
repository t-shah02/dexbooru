<script context="module">
	export async function load({ fetch, session }) {
		const auth = session.authenticated;
		if (auth) {
			const email = session.email;
			const username = session.username;
			const pfp = session.pfp;
			const posts = JSON.parse(session.posts);
			const numPosts = posts.length;

			const response = await fetch(`/api/posts/user/${username}`);
			const data = await response.json();
			const allPosts = data.posts;



			return {
				props: {
					email: email,
					username: username,
					pfp: pfp,
					numPosts: numPosts,
					allPosts: allPosts
				}
			};
		}
		return { status: 302, redirect: '/' };
	}
</script>

<script>
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import PostCard from '../components/PostCard.svelte';
	import {darkBodyColor, lightModeColor, darkCardColor} from "../colors.js";
	import {darkmode} from "../stores.js";
import { post } from './api/comment';
import { isPostfixUnaryExpression } from 'typescript';
	


	export let email;
	export let username;
	export let pfp;
	export let numPosts;
	export let allPosts;

	let pageNumber = 0;
	let loadingMorePosts = false;
	let noMorePosts = false;

	async function fetchMorePosts() {
		const response = await fetch(`/api/posts/user/${username}/?page=${pageNumber}`);
		const { posts } = await response.json();

		if (!posts.length) {
			noMorePosts = true;
		} else {
			allPosts = allPosts.concat(posts);
		}
	}

	onMount(() => {
		window.onscroll = async function () {
			if (
				window.innerHeight + window.pageYOffset >= document.body.offsetHeight &&
				!loadingMorePosts
			) {
				if (!noMorePosts) {
					pageNumber++;
					loadingMorePosts = true;
					await fetchMorePosts();
					loadingMorePosts = false;
				}
			}
		};
	});
</script>

<svelte:head>
	<title>Profile - {username}</title>
</svelte:head>

<div id="profile" style="background-color : {$darkmode ? darkBodyColor : lightModeColor}" out:slide>
	<h1 style="color : {$darkmode ? lightModeColor : darkBodyColor}" class="profile-title">Profile</h1>
	<div class="card" style="background-color : {$darkmode ? darkCardColor : lightModeColor}" >
		<div class="image">
			<a target="_blank" href={pfp}>
				<img src={pfp} alt="profile picture of {username}" width="10%" />
			</a>
		</div>
		<div class="card-content">
			<div class="media">
				<div class="media-content">
					<p style="color : {$darkmode ? lightModeColor : darkBodyColor}" class="title is-8">{username}</p>
					<p style="color : {$darkmode ? lightModeColor : darkBodyColor}" class="subtitle is-6">Email : {email}</p>
					<p style="color : {$darkmode ? lightModeColor : darkBodyColor}" class="subtitle is-6">Number of posts : {numPosts}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="posts-container">
		<h1 style="color : {$darkmode ? lightModeColor : darkBodyColor}">All posts from {username}</h1>
		<div class="posts">
			{#each allPosts as post}
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
		{#if loadingMorePosts}
			<div class="lds-hourglass" />
		{/if}
		{#if noMorePosts}
			<section class="hero is-success">
				<div class="hero-body">
					<p class="title">You have reached the end!</p>
					<p class="subtitle">No more posts to show.</p>
				</div>
			</section>
		{/if}
	</div>
</div>

<style>
	#profile {
		min-height : 100vh;
		padding-top: 25px;
		padding-bottom: 50px;
		transition : background-color 200ms ease-in-out;
	}

	section {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50px;
		width: 60%;
		border-radius: 10px;
	}

	.lds-hourglass {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
		margin-bottom: 50px;
	}

	.lds-hourglass:after {
		content: ' ';
		display: block;
		border-radius: 50%;
		width: 0;
		height: 0;
		margin: 8px;
		box-sizing: border-box;
		border: 32px solid black;
		border-color: black transparent black transparent;
		animation: lds-hourglass 1.2s infinite;
	}

	@keyframes lds-hourglass {
		0% {
			transform: rotate(0);
			animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		}
		50% {
			transform: rotate(900deg);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}
		100% {
			transform: rotate(1800deg);
		}
	}

	.posts-container {
		text-align: center;
	}

	.posts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 20px;
	}

	.profile-title {
		text-align: center;
		margin-top: 50px;
	}

	.image {
		width: 40%;
		margin-left: 2.5%;
		margin-right: 2.5%;
		position: relative;
	}

	img {
		max-height: 75%;
		max-width: 75%;
		width: auto;
		height: auto;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		border-radius : 10px;
		transition : transform 100ms ease-in-out;
	}


	img:hover {
		transform : scale(1.01);
	}

	.card {
		text-align: center;
		display: flex;
		margin-left: auto;
		margin-right: auto;
		width: 50%;
		height: 25%;
		margin-top: 5px;
		margin-bottom: 100px;
		transition: transform 200ms ease-in-out;
	}

	@media only screen and (max-width: 780px) {
		.card {
		text-align: center;
		display: flex;
		flex-direction: column;
		margin-left: auto;
		margin-right: auto;
		width: 80%;
		margin-top: 5px;
		margin-bottom: 100px;
		transition: transform 200ms ease-in-out;
		}
		.image {
		width: 75%;
		min-height: 150px;
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		align-self: center;
		}

	}

	@media (min-width: 781px) and (max-width: 1023px) {
		.card {
		text-align: center;
		display: flex;
		flex-direction: column;
		margin-left: auto;
		margin-right: auto;
		width: 60%;
		margin-top: 5px;
		margin-bottom: 100px;
		transition: transform 200ms ease-in-out;
		}
		.image {
		width: 75%;
		min-height: 150px;
		margin-left: auto;
		margin-right: auto;
		left: 0;
		right: 0;
		align-self: center;
		}
	}
	
	.card:hover {
		transform: scale(1.02);
	}
</style>
