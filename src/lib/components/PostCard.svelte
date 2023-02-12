<script lang="ts">
	import type { ImageData } from '$lib/interfaces/posts';
	import { prettifyDate } from '$lib/dates/helpers';

	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/navigation';
	import { Pagination, Navigation } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import '$lib/assets/styles/swiper.css';

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

<div
	class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<a href={postUrl}>
		<img class="rounded-t-lg" src={censoredImages[0]} alt="" />
	</a>
	<div class="p-5">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			{authorName} @ {prettyDate}
		</h5>

		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			Views: {views}
		</p>

		<button
			type="button"
			class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>Save post</button
		>

		<button
			type="button"
			class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>Report post</button
		>
	</div>
</div>

