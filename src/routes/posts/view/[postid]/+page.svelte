<script lang="ts">
	import CommentBox from '$lib/components/CommentBox.svelte';
	import CommentContainer from '$lib/components/CommentList.svelte';
	import { prettifyDate } from '$lib/dates/helpers';
	import type { PageData } from './$types';
	import { allComments } from '$lib/stores/commentStores';

	export let data: PageData;
	const post = data.post;

	const postId = post.postId;
	const tags = post.tags;
	const artists = post.artists;
	const images = post.images;
	const authorName = post.authorName;
	const date = prettifyDate(post.date);
	const views = post.views;
	const comments = post.comments;
	allComments.set(comments);

	let isBlurred = true;
	let censoredImages: string[] = images.map((image) => image.censored);
	let uncensoredImages: string[] = images.map((image) => image.uncensored);

	const generateRandomColor = () => {
		const r = Math.floor(Math.random() * 255);
		const g = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);

		return `${r},${g},${b}`;
	};
</script>

<main>
	<div class="post-info">
		<section>
			<h5>Post id:</h5>
			<h6>{postId}</h6>
			<h5>Uploader:</h5>
			<a href="/profile/{authorName}" class="underline uploader-link">
				<h6>{authorName}</h6>
			</a>
			<h5>Date uploaded:</h5>
			<h6>{date}</h6>
			<h5>Views:</h5>
			<h6>{views}</h6>
		</section>
		<section>
			<h5>Artist(s)</h5>
			<ul>
				{#each artists as artist}
					<a class="chip border">
						{artist}
					</a>
				{/each}
			</ul>
		</section>
		<section>
			<h5>Tags</h5>
			<ul>
				{#each tags as tag}
					<a class="chip border">
						{tag}
					</a>
				{/each}
			</ul>
		</section>
	</div>

	<img class="post-image" src={uncensoredImages[0]} />

	<CommentBox postID={postId} />
	<CommentContainer />
</main>

<style>
	main {
		margin: 10px 20px 100px 20px;
	}

	.post-image {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	.uploader-link {
		color: blue;
	}

	h6 {
		margin-left: 5px;
	}

	section {
		margin: 10px;
	}

	.chip {
		margin: 5px;
	}
</style>
