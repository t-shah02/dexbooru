<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';

	export let postId: string;
	export let date: Date;
	export let views: number;
	export let images: string[];
	export let authorName: string;
	export let nsfw: boolean;

	let isBlurred = nsfw;

	let prettyDate = '';

	$: {
		prettyDate = prettifyDate(date);
		isBlurred = nsfw;
	}
	const postUrl = `/posts/view/${postId}`;
	const authorUrl = `/profile/${authorName}`;

	const toggleBlur = () => {
		isBlurred = !isBlurred;
	};
</script>

<div
	class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<a href={postUrl}>
		<img class="rounded-t-lg" src={images[0]} alt="" />
	</a>
	<div class="p-5">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			<a href={authorUrl} class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
				>{authorName}</a
			>
			@ {prettyDate}
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
