<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';

	export let content: string;
	export let senderName: string;
	export let senderProfilePictureURL: string;
	export let dateSent: number;
</script>

<div
	class="w-full p-2 bg-white border-gray-200  hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
	role="alert"
>
	<div class="flex">
		<img class="w-8 h-8 rounded-full" src={senderProfilePictureURL} alt="profile of {senderName}" />
		<div class="ml-3 text-sm font-normal">
			<span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">{senderName}</span>
			<span class="mb-1 text-sm font-semibold text-gray-500 dark:text-white"
				>· {prettifyDate(new Date(dateSent))}</span
			>
			<div class="mb-2 text-sm font-normal">
				<p class="mb-3 text-gray-500 dark:text-gray-400">
					{content}
				</p>
			</div>
		</div>
	</div>
</div>
