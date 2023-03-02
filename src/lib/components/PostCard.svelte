<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';

	export let postId: string;
	export let date: Date;
	export let views: number;
	export let images: string[];
	export let authorName: string;
	export let nsfw: boolean;
	export let tags: string[];

	$: {
		prettyDate = prettifyDate(date);
		isBlurred = nsfw;
	}

	let isBlurred = nsfw;
	let prettyDate = '';
	let imageIndex = 0;

	const goLeft = () => {
		imageIndex = imageIndex - 1 < 0 ? images.length - 1 : imageIndex - 1;
	};

	const goRight = () => {
		imageIndex = imageIndex + 1 == images.length ? 0 : imageIndex + 1;
	};

	const postUrl = `/posts/view/${postId}`;
	const authorUrl = `/profile/${authorName}`;
</script>

<div
	class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<a href={postUrl}>
		<img
			class="rounded-t-lg w-full current-image"
			src={images[imageIndex]}
			alt={tags.join(',') + `image #${imageIndex + 1}`}
		/>
	</a>

	<div class="p-5">
		{#if images.length > 1}
			<div class="flex justify-center">
				<button
					on:click={goLeft}
					type="button"
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					<i class="fa-solid fa-arrow-left" />
				</button>
				<button
					on:click={goRight}
					type="button"
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					<i class="fa-solid fa-arrow-right" />
				</button>
			</div>
		{/if}
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			<a href={authorUrl} class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
				>{authorName}</a
			>
			@ {prettyDate}
		</h5>

		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			Views: {views}
		</p>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			Total images: {images.length}
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