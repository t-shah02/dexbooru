<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import { slide } from 'svelte/transition';

	export let content: string;
	export let senderName: string;
	export let senderProfilePictureURL: string;
	export let dateSent: number;
</script>

<div
	in:slide
	class="mt-2 mb-2 p-1 border-gray-200  hover:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
	role="alert"
>
	<div class="flex mt-2 ml-5">
		<img class="w-8 h-8 rounded-full" src={senderProfilePictureURL} alt="profile of {senderName}" />
		<div class="ml-3 text-sm font-normal">
			<span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{senderName}</span>
			<span class="mb-1 text-sm font-semibold text-gray-500 dark:text-white"
				>· {prettifyDate(new Date(dateSent))}</span
			>
			<div class="mb-2 text-sm format">
				<p class="break-words mb-3 text-gray-500 dark:text-gray-400">
					{@html content.replace(
						/<strong>/g,
						'<strong class="font-bold text-gray-500 dark:text-gray-400">'
					)}
				</p>
			</div>
		</div>
	</div>
</div>
