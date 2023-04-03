<script lang="ts">
	export let authorName: string;
	export let authorProfilePictureURL: string;
	export let views: number;
	export let date: string;
	export let postId: string;
</script>

<div
	class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-auto"
>
	<a class="flex space-x-5" href="/profile/{authorName}">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		    Uploaded by: {authorName}
		</h5>

		<img
			class="w-10 h-10 rounded-full"
			src={authorProfilePictureURL}
			alt="profile of {authorName}"
		/>
	</a>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
		Views: {views}
	</p>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
		Date posted: {date}
	</p>
</div>
