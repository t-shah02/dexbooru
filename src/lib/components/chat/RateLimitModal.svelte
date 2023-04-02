<script lang="ts">
	import Close from '../svgs/Close.svelte';

	export let onClose: () => void;
</script>

<div
	id="rate-limiter-modal"
	tabindex="-1"
	class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full"
>
	<div class="relative w-full h-full max-w-md md:h-auto">
		<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
			<button
				on:click={onClose}
				type="button"
				class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
			>
				<Close />
				<span class="sr-only">Close modal</span>
			</button>
			<div class="p-6 text-center">
				<svg
					aria-hidden="true"
					class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Woah calm down, you are sending messages blazingly fast
				</h3>
				<button
					on:click={onClose}
					type="button"
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					Return to the chill zone :))
				</button>
			</div>
		</div>
	</div>
</div>
