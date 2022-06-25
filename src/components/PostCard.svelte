<script>
	import { slide } from 'svelte/transition';

	export let imageSourceURL;
	export let uploadDate;
	export let uploader;
	export let tags;
	export let postID;

	let postUrlPath = `/posts/${postID}`;

	let showTags = false;

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
</script>

<div class="card">
	<a href={postUrlPath}>
		<div class="card-img" style="background-image : url({imageSourceURL})" />
	</a>
	<div class="post-info-container">
		<h1 class="uploader-title">Uploader: {uploader}</h1>
		<h1 class="date-title">Date uploaded: {uploadDate}</h1>
	</div>
	<hr />
	<div class="tag-show-box" on:click={dispTagOnClick}>
		<h1 class="show-tag-heading">Show tags</h1>
		<i id="angle-arrow" class="fa-solid fa-angle-down" />
	</div>
	{#if showTags}
		<div in:slide out:slide class="block">
			{#each tags as tag}
				<a href="https://google.ca"
					><span class="tag {colors[Math.floor(Math.random() * colors.length)]}">{tag}</span></a
				>
			{/each}
		</div>
	{/if}
</div>

<style>
	.post-info-container {
		margin-top: 25px;
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
		text-decoration: none;
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
		background-color: pink;
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
	}

	.uploader-title {
		text-align: center;
		font-size: 15px;
		margin-top: 10px;
	}
</style>
