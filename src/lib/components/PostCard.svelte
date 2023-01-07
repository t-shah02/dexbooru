<script lang="ts">
	export let postId: string;
	export let date: Date;
	export let likes: number;
	export let images: string[];
	export let authorName: string;
	export let authorProfileUrl: string;
	export let tags: string[];
	export let artists: string[];
	export let nsfw: boolean;

	const ymdFormat = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}`;

	let imageIndex = 0;

	const goLeft = () => {
		imageIndex++;
		if (imageIndex >= images.length) {
			imageIndex = 0;
		}
	};

	const goRight = () => {
		imageIndex--;
		if (imageIndex < 0) {
			imageIndex = images.length - 1;
		}
	};
</script>

<div class="post-card">
	<div class="card-header">
		<div class="uploader-info">
			<img
				class="uploader-pfp circle tiny"
				src={authorProfileUrl}
				alt="profile image of {authorProfileUrl}"
			/>
			<h6>{authorName}</h6>
			<h6>{ymdFormat}</h6>
		</div>
	</div>
	<div class="card-images-body">
		<img
			class="active-post-image"
			src={images[imageIndex]}
			alt="post id {postId} image # {imageIndex + 1}"
		/>
	</div>
	<div class="card-footer" />
</div>

<style>
	.post-card {
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		border-radius: 10px;
		height: 350px;
	}

	h6 {
		margin: 0;
	}

	.card-images-body {
		height : 75%;
	}

	.uploader-info {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.active-post-image {
		display: block;
		border-radius: 0px;
		width : 100%;
		object-fit: contain;
		max-height: 100%;
	}
</style>
