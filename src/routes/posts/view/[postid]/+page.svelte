<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { PageData } from './$types';

	export let data: PageData;
	const post = data.post;

	const postId = post.postId;
	const tags = post.tags;
	const artists = post.artists;
	const images = post.images;
	const authorName = post.authorName;
	const authorProfilePictureURL = post.authorProfileUrl;
	const date = prettifyDate(post.date);
	const views = post.views;

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

<section class="block m-auto ">
	{#each uncensoredImages as image}
		<img class="viewing-img" src={image} />
	{/each}
</section>
<div class="flex justify-center post-data">
	<div class="post-metadata">
		<div class="info-section">
			<h3>Artists</h3>
			<ul>
				{#each artists as artist}
					<a style="background-color : rgb({generateRandomColor()})" class="chip border">
						{artist}
					</a>
				{/each}
			</ul>
		</div>
		<div class="info-section">
			<h3>Tags</h3>
			<ul>
				{#each tags as tag}
					<a style="background-color : rgb({generateRandomColor()})" class="chip border">
						{tag}
					</a>
					<br />
				{/each}
			</ul>
		</div>
	</div>

	<div class="uploader-data">
		<div class="info-section">
			<h3>Uploaded by:</h3>
			<div class="flex profile-box">
				<img
					class="circle tiny"
					src={authorProfilePictureURL}
					alt="profile picture for {authorName}"
				/>
				<h4>
					<a href="/profile/{authorName}" class="underline uploader-name">{authorName}</a>
				</h4>
			</div>
		</div>
		<div class="info-section">
			<h3>Date uploaded:</h3>
			<h4>{date}</h4>
		</div>
		<div class="info-section">
			<h3>Views:</h3>
			<h4>{views}</h4>
		</div>
		<div class="info-section">
			<h3>Post id:</h3>
			<h4>{postId}</h4>
		</div>
	</div>
</div>

<style>
	.info-section {
		margin-top: 7.5px;
		margin-bottom: 7.5px;
	}

	.uploader-name {
		color: green;
	}

	.profile-box img {
		margin-right: 5px;
	}

	section {
		max-width: 2400px;
		box-sizing: border-box;
		display: grid;
		place-items: center;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		justify-content: center;
		margin : 20px;
	}

	.chip {
		margin-top: 2.5px;
		margin-bottom: 2.5px;
		color: white !important;
		font-size: 13px;
		margin-left: 0;
		padding: 5px;
		border-color: transparent;
	}

	ul {
		display : flex;
	}

	.post-data {
		height : max-content;
		margin-bottom : 100px;
	}	

</style>
