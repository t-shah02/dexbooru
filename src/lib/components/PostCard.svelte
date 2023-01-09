<script lang="ts">
	import type { ImageData } from '$lib/interfaces/posts';
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/navigation';
	import { Pagination, Navigation } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import '$lib/assets/swiper.css';

	export let postId: string;
	export let date: Date;
	export let likes: number;
	export let images: ImageData[];
	export let authorName: string;
	export let authorProfileUrl: string;
	export let tags: string[];
	export let artists: string[];
	export let nsfw: boolean;

	let isBlurred = nsfw;
	let censoredImages = images.map((imageData) => imageData.censored);
	let uncensoredImages = images.map((imageData) => imageData.uncensored);

	const ymdFormat = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}`;
	const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
	const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
	const timeStampFormat = `${hours}:${minutes}`;
	const finalDatePostedFormat = `${ymdFormat} @ ${timeStampFormat}`;

	const postUrl = `/posts/view/${postId}`;

	const toggleBlur = () => (isBlurred = !isBlurred);
</script>

<article class="no-padding">
	<div class="grid no-space">
		<div class="s6">
			<Swiper
				slidesPerView={1}
				loop={images.length > 1 ? true : false}
				pagination={{
					clickable: true
				}}
				navigation={images.length > 1 ? true : false}
				modules={images.length > 1 ? [Pagination, Navigation] : []}
				class="mySwiper"
			>
				{#if isBlurred}
					{#each Object.entries(censoredImages) as [index, image]}
						<SwiperSlide>
							<a href={postUrl}>
								<img class="responsive" src={image} alt="image #{index + 1} for {postId}" />
							</a>
						</SwiperSlide>
					{/each}
				{:else}
					{#each Object.entries(uncensoredImages) as [index, image]}
						<SwiperSlide>
							<a href={postUrl}>
								<img class="responsive" src={image} alt="image #{index + 1} for {postId}" />
							</a>
						</SwiperSlide>
					{/each}
				{/if}
			</Swiper>
		</div>
		<div class="s6">
			<div class="uploader-info padding">
				<h6>
					<a href="/profile/{authorName}">
						<img
							class="circle tiny"
							style="margin-right : 3.5px"
							src={authorProfileUrl}
							alt="profile picture for {authorName}"
						/>
						{authorName}
					</a>
				</h6>
				<h6>
					<i>schedule</i>
					{finalDatePostedFormat}
				</h6>
			</div>
			{#if nsfw}
				<div class="nsfw-container">
					<p>
						<i>warning</i>
						This post has been marked as NSFW. Unblur photos at your own risk!
					</p>
					<label class="blur-checkbox checkbox">
						<input type="checkbox" on:change={toggleBlur} checked />
						<span>Blur image</span>
					</label>
				</div>
			{/if}
		</div>
	</div>
</article>

<style>
	article {
		width: 350px;
	}

	img {
		cursor: pointer;
	}
	.s6 {
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;
	}

	.grid {
		display: flex;
		flex-direction: column;
	}

	.uploader-info {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}

	.nsfw-container {
		margin: 5px;
		display: flex;
		flex-direction: column;
	}

	.nsfw-container p {
		text-align: center;
		color: red;
		font-size: 12px;
	}

	.blur-checkbox {
		display: inline-block;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 15px;
	}

	h6 {
		font-size: 18px;
		margin: 0;
	}

	i {
		margin-right: 5px;
	}
</style>
