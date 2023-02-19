<script lang="ts">
	import { onMount } from 'svelte';
	import { Dismiss } from 'flowbite';
	import type { DismissOptions, DismissInterface } from 'flowbite';

	let successDismiss: DismissInterface;

	onMount(() => {
		// target element that will be dismissed
		const targetEl: HTMLElement | null = document.getElementById('failure-alert');

		// optional trigger element
		const triggerEl: HTMLElement | null = document.getElementById('failure-alert-button');

		// options object
		const options: DismissOptions = {
			transition: 'transition-opacity',
			duration: 1000,
			timing: 'ease-out'
		};

		/*
		 * targetEl: required
		 * triggerEl: optional
		 * options: optional
		 */
		successDismiss = new Dismiss(targetEl, triggerEl, options);
	});

	export let message: string;
</script>

<div
	id="failure-alert"
	class="p-4 mb-10 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
	role="alert"
>
	<div class="flex items-center">
		<svg
			aria-hidden="true"
			class="w-5 h-5 mr-2"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
				clip-rule="evenodd"
			/></svg
		>
		<span class="sr-only">Info</span>
		<h3 class="text-lg font-medium">Upload error</h3>
	</div>
	<div class="mt-2 mb-4 text-sm">
		{message}
	</div>
	<div class="flex">
		<button
			id="failure-alert-button"
			type="button"
			class="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
			data-dismiss-target="#alert-additional-content-2"
			aria-label="Close"
		>
			Dismiss
		</button>
	</div>
</div>
