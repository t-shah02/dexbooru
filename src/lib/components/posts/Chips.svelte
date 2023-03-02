<script lang="ts">
	export let tags: string[];
	export let artists: string[];
</script>

<div class="flex flex-col">
	<div class="flex flex-wrap justify-center">
		{#each tags as tag}
			<a
				href="/tags/{tag}"
				class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>
				<i class="fa-solid fa-tag mr-3" />
				{tag}
			</a>
		{/each}
	</div>
	<div class="flex flex-wrap justify-center">
		{#each artists as artist}
			<a
				href="/artists/{artist}"
				class="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
			>
				<i class="fa-solid fa-palette mr-3" />
				{artist}
			</a>
		{/each}
	</div>
</div>

