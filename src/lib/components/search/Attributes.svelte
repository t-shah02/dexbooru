<script lang="ts">
	export let tags: string[] = [];
	export let artists: string[] = [];
	export let uploaders: string[] = [];
</script>

<div class="flex flex-col space-y-2">
	<h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Tags:</h2>
	<ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
		{#each tags as tag}
			<li>{tag}</li>
		{/each}
	</ul>
	<h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Artists:</h2>
	<ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
		{#each artists as artist}
			<li>{artist}</li>
		{/each}
	</ul>
	<h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Uploaders:</h2>
	<ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
		{#each uploaders as uploader}
			<li>{uploader}</li>
		{/each}
	</ul>
</div>
