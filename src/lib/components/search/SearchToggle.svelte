<script lang="ts">
	import { searchModalController } from '$lib/stores/globalStores';

	const openSearchModal = () => {
		if ($searchModalController) {
			$searchModalController.show();
		}
	};
</script>

<button
	on:click={openSearchModal}
	class="ml-2 mr-2 text-gray-500 dark:text-gray-400 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
>
	<div class="m-2 flex space-x-2">
		<kbd
			class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
			>Ctrl</kbd
		>
		<span>+</span>
		<kbd
			class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
			>K</kbd
		>
		<div class="flex align-center space-x-2">
			<h3>Search</h3>
			<svg
				aria-hidden="true"
				class="w-5 text-gray-500 dark:text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/></svg
			>
		</div>
	</div>
</button>
