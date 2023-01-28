<script lang="ts">
	import type { ImageData } from '$lib/interfaces/posts';
	import { prettifyDate } from '$lib/dates/helpers';

	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/navigation';
	import { Pagination, Navigation } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import '$lib/assets/swiper.css';

	export let postId: string;
	export let date: Date;
	export let views: number;
	export let images: ImageData[];
	export let authorName: string;
	export let authorProfileUrl: string;
	export let tags: string[];
	export let artists: string[];
	export let nsfw: boolean;

	let isBlurred = nsfw;

	let prettyDate = '';
	let censoredImages: string[] = [];
	let uncensoredImages: string[] = [];

	$: {
		prettyDate = prettifyDate(date);
		isBlurred = nsfw;

		censoredImages = images.map((image) => image.censored);
		uncensoredImages = images.map((image) => image.uncensored);
	}
	const postUrl = `/posts/view/${postId}`;

	const toggleBlur = () => {
		isBlurred = !isBlurred;
	};
</script>

<article class="no-padding">
	<div class="grid no-space">
		<div class="s6">
			{#if isBlurred}
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
					{#each Object.entries(censoredImages) as [index, image]}
						<SwiperSlide>
							<a href={postUrl}>
								<img class="responsive" src={image} alt="image #{index + 1} for {postId}" />
							</a>
						</SwiperSlide>
					{/each}
				</Swiper>
			{:else}
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
					{#each Object.entries(uncensoredImages) as [index, image]}
						<SwiperSlide>
							<a href={postUrl}>
								<img class="responsive" src={image} alt="image #{index + 1} for {postId}" />
							</a>
						</SwiperSlide>
					{/each}
				</Swiper>
			{/if}
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
				<div class="flex">
					<button>
						<i style="color : green">bookmark</i>
						<div class="tooltip bottom">Save post</div>
					</button>
					<button>
						<i style="color : red">report</i>
						<div class="tooltip bottom">Report post</div>
					</button>
				</div>
			</div>
			<div class="flex justify-around ml-40 mb-40">
				<div class="flex">
					<i>calendar_month</i>
					<h1>{prettyDate}</h1>
				</div>
				<div class="flex">
					<i>visibility</i>
					<h1>{views} view(s)</h1>
				</div>
			</div>
			{#if nsfw}
				<div class="flex justify-around ml-40 mb-40">
					<div class="flex">
						<i class="mt-20">priority_high </i>
						<h1>Post is NSFW</h1>
					</div>

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
		margin : 10px;
		transition: scale 150ms ease-in-out;
	}

	article:hover {
		scale: 1.05;
	}

	img {
		width: 100%;
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
		margin-left: 5px;
	}
</style>
