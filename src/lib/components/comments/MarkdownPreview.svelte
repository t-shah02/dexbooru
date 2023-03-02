<script lang="ts">
	import { Modal } from 'flowbite';
	import type { ModalOptions, ModalInterface } from 'flowbite';
	import { Tooltip } from 'flowbite';
	import type { TooltipOptions, TooltipInterface } from 'flowbite';
	import { onMount } from 'svelte';
	import { convertAndCleanRawMD } from '$lib/comments/markdownHelpers';

	export let comment: string = '';
	let markdownComment = '';

	$: {
		markdownComment = convertAndCleanRawMD(comment);
	}

	let modal: ModalInterface;
	let tooltip: TooltipInterface;
	let modalID = crypto.randomUUID();
	let tooltipID = crypto.randomUUID();
	let tooltipTriggerID = crypto.randomUUID();

	onMount(() => {
		const markdownModalElement = document.querySelector(`#modal-${modalID}`);
		const toolTipElement = document.querySelector(`#tooltip-${tooltipID}`);
		const toolTipTargetElement = document.querySelector(`#tooltip-trigger-${tooltipTriggerID}`);

		if (markdownModalElement && toolTipElement && toolTipTargetElement) {
			const modalOptions: ModalOptions = {
				placement: 'center',
				backdrop: 'dynamic',
				backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
				closable: true
			};

			const options: TooltipOptions = {
				placement: 'top',
				triggerType: 'hover'
			};

			modal = new Modal(markdownModalElement as HTMLElement, modalOptions);
			new Tooltip(toolTipElement as HTMLElement, toolTipTargetElement as HTMLElement, options);

			markdownComment = convertAndCleanRawMD(comment);
		}
	});
</script>

<div class="flex pl-0 space-x-1 sm:pl-2">
	<button
		on:click={() => modal.show()}
		id={`tooltip-trigger-${tooltipTriggerID}`}
		type="button"
		class="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
	>
		<i class="fa-brands fa-markdown" />
		<span class="sr-only">Preview markdown</span>
	</button>
	<div
		id={`tooltip-${tooltipID}`}
		role="tooltip"
		class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
	>
		Preview comment in Markdown
		<div class="tooltip-arrow" data-popper-arrow />
	</div>
</div>
<div
	id={`modal-${modalID}`}
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
					Markdown preview of your comment
				</h3>
			</div>
			<!-- Modal body -->
			<div class="p-6 space-y-6">
				<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
					{@html markdownComment}
				</p>
			</div>
		</div>
	</div>
</div>
