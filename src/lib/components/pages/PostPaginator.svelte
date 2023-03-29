<script lang="ts">
	export let pageNumber: number;
</script>

<nav aria-label="Navigator for {pageNumber + 1}" class="paginator flex justify-center mt-5">
	<ul class="inline-flex -space-x-px">
		<li>
			<a
				data-sveltekit-reload
				style="pointer-events: {pageNumber - 1 >= 0 ? '' : 'none'}"
				href="/?page={pageNumber - 1}"
				class="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				><i class="fa-solid fa-arrow-left" /></a
			>
		</li>

		<li>
			<span
				class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				>{pageNumber + 1}</span
			>
		</li>
		<li>
			<a
				data-sveltekit-reload
				href="/?page={pageNumber + 1}"
				class="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				><i class="fa-solid fa-arrow-right" /></a
			>
		</li>
	</ul>
</nav>
