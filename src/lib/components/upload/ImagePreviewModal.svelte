<script lang="ts">
	import { Modal } from 'flowbite';
	import type { ModalOptions, ModalInterface } from 'flowbite';
	import { onMount } from 'svelte';

	export let imageEncoding: string | undefined = '';
	export let modalID: string;
	export let fileName: string;

	const modalOptions: ModalOptions = {
		placement: 'top-center',
		backdrop: 'dynamic',
		backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
		closable: true
	};

	let modal: ModalInterface;

	onMount(() => {
		const modalElement = document.querySelector(`#${modalID}`) as HTMLElement;

		if (modalElement) {
			modal = new Modal(modalElement, modalOptions);
		}
	});
</script>

<button
	on:click={() => modal.show()}
	type="button"
	class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
>
	<i class="fa-solid fa-eye" />
</button>

<div
	id={modalID}
	tabindex="-1"
	aria-hidden="true"
	class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
>
	<div class="relative w-full h-full max-w-2xl md:h-auto">
		<!-- Modal content -->
		<div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
			<!-- Modal header -->
			<div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
				<h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white">
					Preview of {fileName}
				</h3>
				<button
					on:click={() => modal.hide()}
					type="button"
					class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
				>
					<svg
						class="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/></svg
					>
				</button>
			</div>
			<!-- Modal body -->
			<div class="p-6 space-y-6">
				<img
					class="max-w-full max-h-fit rounded-lg shadow-xl dark:shadow-gray-800 mx-auto"
					src={imageEncoding}
					alt="preview of {fileName}"
				/>
			</div>
			<!-- Modal footer -->
			<div
				class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
			>
				<button
					on:click={() => modal.hide()}
					type="button"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Close preview</button
				>
			</div>
		</div>
	</div>
</div>
