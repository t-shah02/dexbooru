<script>
	import { slide, fade } from 'svelte/transition';
	import { darkmode } from '../stores';
	import { postCardLightColor, postCardDarkColor } from '../colors.js';

	export let postImages;
	export let uploadDate;
	export let uploader;
	export let tags;
	export let postID;
	export let artist;

	let postUrlPath = `/posts/${postID}`;

	let showTags = false;

	let isLiked = false;

	let heartItem;

	let postImageIndex = 0;
	let numImages = postImages.length;

	let colors = ['is-success', 'is-link', 'is-warning', 'is-danger', 'is-primary'];

	function dispTagOnClick(e) {
		const clickedElement = e.target;
		const elementType = clickedElement.nodeName;
		let angleIcon;
		if (elementType == 'H1' || elementType == 'I') {
			const parentNode = clickedElement.parentNode;
			angleIcon = parentNode.querySelector('#angle-arrow');
		} else {
			angleIcon = clickedElement.querySelector('#angle-arrow');
		}

		if (showTags) {
			angleIcon.className = 'fa-solid fa-angle-down';
		} else {
			angleIcon.className = 'fa-solid fa-angle-up';
		}

		angleIcon.style.paddingLeft = '5px';
		angleIcon.style.paddingRight = '5px';
		angleIcon.style.transform = 'translateY(25%)';
		showTags = !showTags;
	}

	function likePost(e) {
		if (isLiked) {
			heartItem.classList.remove('liked');
		} else {
			heartItem.classList.add('liked');
		}
		isLiked = !isLiked;
	}

	function shiftPost(e) {
		const target = e.target.nodeName === "I" ? e.target.parentNode : e.target;
		const direction = target.dataset.direction;
		

		if (direction === 'left') {
			postImageIndex = postImageIndex - 1 < 0 ? postImages.length - 1 : postImageIndex - 1;
		} else if (direction === 'right') {
			postImageIndex = postImageIndex + 1 >= postImages.length ? 0 : postImageIndex + 1;
		}
	}
</script>

<div class="card" style="background-color : {$darkmode ? postCardDarkColor : postCardLightColor}">
	<div class="card-img" style="background-image : url({`${postImages[postImageIndex].imageURL}?test`})">
		{#if postImages.length > 1}
			<button
				on:click={shiftPost}
				class="is-primary left-btn button has-tooltip-top"
				data-tooltip="Previous"
				data-direction="left"
			>
				<i class="fa-solid fa-arrow-left"></i>
			</button>
			<button
				on:click={shiftPost}
				class="is-primary right-btn button has-tooltip-top"
				data-tooltip="Next"
				data-direction="right"
			>
				<i class="fa-solid fa-arrow-right"></i>
			</button>
		{/if}
	</div>

	<div class="post-info-container">
		<a href={postUrlPath} target="_blank">View this post</a>
		<h1 class="uploader-title">Uploader: {uploader}</h1>
		<h1 class="artist-title">Artist: {artist.length ? artist : 'Unknown'}</h1>
		<h1 class="date-title">Date uploaded: {uploadDate}</h1>
		<h1 class="num-posts-title">Total images in this post: {numImages}</h1>
	</div>
	<div class="actionrow">
		<div id="container">
			<div bind:this={heartItem} on:click={likePost} class="heart-like-button" />
		</div>
	</div>
	<hr />
	<div class="tag-show-box" on:click={dispTagOnClick}>
		<h1 class="show-tag-heading">Show tags</h1>
		<i id="angle-arrow" class="fa-solid fa-angle-down" />
	</div>
	{#if showTags}
		<div in:slide out:slide class="block">
			{#each tags as tag}
				<a href={`/search?query=${tag.split(" ").length > 1 ? `"${tag}"` : tag}`}
					><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">{tag}</span></a
				>
			{/each}
		</div>
	{/if}
</div>

<style>
	.post-info-container {
		margin-top: 25px;
		text-align: center;
	}

	.tag-show-box {
		display: flex;
		justify-content: center;
		padding-bottom: 15px;
	}

	.tag-show-box:hover {
		cursor: pointer;
	}

	.fa-solid {
		transform: translateY(25%);
		padding-left: 5px;
		padding-right: 5px;
	}

	.fa-solid:active {
		animation: rotate-arrow 0.5s linear;
	}

	@keyframes rotate-arrow {
		from {
			-webkit-transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(180deg);
		}
	}

	.block {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	a {
		color : black;
		text-decoration: none;
	}
	
	a:visited {
		color : black;
	}

	a:hover {
		color : black;
	}

	.tag {
		margin: 5px;
		transition: all 100ms ease-in-out;
	}

	.tag:hover {
		transform: scale(1.1);
	}

	.show-tag-heading {
		font-size: 18px;
		text-align: center;
	}

	.card {
		position: relative;
		margin: 35px;
		border-radius: 10px;
		width: 350px;
		transition: all 350ms;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}

	
	.card:hover {
		transform: scale(1.02);
	}

	.date-title {
		text-align: center;
		font-size: 15px;
		margin-top: 2px;
	}

	.card-img {
		height: 500px;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		position: relative;
		transition : background-image 500ms ease-in-out;
	}

	.card-img:hover .left-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 60px; 
		position: absolute;
		top: 50%;
		left: 10%;
		animation-play-state: running;
			
	}

	.card-img:hover .right-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 60px; 
		position: absolute;
		top: 50%;
		right: 10%;
		animation-play-state: running;
	}

	i {
		vertical-align: middle;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.left-btn {
		display: none;
		animation: fade-in 200ms ease-in-out;
		animation-play-state: paused;
	}

	.right-btn {
		display: none;
		animation: fade-in 200ms ease-in-out;
		animation-play-state: paused;
	}

	.uploader-title {
		text-align: center;
		font-size: 15px;
		margin-top: 10px;
	}

	.num-posts-title {
		text-align: center;
		font-size: 15px;
		margin-top: 10px;
	}

	.artist-title {
		text-align: center;
		font-size: 15px;
		margin-top: 10px;
	}

	.actionrow {
		margin-top: 5px;
		padding: 5px;
		margin-bottom: 5px;
		display: flex;
		justify-content: space-evenly;
	}

	#container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50px;
		padding: 15px 7.5px;
	}
	.heart-like-button {
		position: relative;
		width: 160px;
		height: 130px;
		transform: scale(25%);
		border-color: red;
	}
	.heart-like-button:before {
		position: absolute;
		top: 0;
		left: 80px;
		transform: rotate(-45deg);
		transform-origin: 0 100%;
		width: 80px;
		height: 125px;
		border-radius: 40px 40px 0 0;
		border-color: red;
		background-color: black;
		content: '';
		cursor: pointer;
		transition: background-color 0.4s;
	}
	.heart-like-button:after {
		position: absolute;
		top: 0;
		left: 0;
		transform: rotate(45deg);
		transform-origin: 100% 100%;
		width: 80px;
		height: 125px;
		border-radius: 40px 40px 0 0;
		border-color: red;
		background-color: black;
		content: '';
		cursor: pointer;
		transition: background-color 0.4s;
	}

	.heart-like-button.liked::before,
	.heart-like-button.liked::after {
		background-color: #d65076;
	}
	.heart-like-button.liked {
		animation: liked 0.4s ease;
	}


	@keyframes liked {
		0% {
			transform: scale(0.15);
		}
		50% {
			transform: scale(0.3);
		}
		100% {
			transform: scale(0.25);
		}
	}

	
	
</style>
