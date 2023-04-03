<script lang="ts">
	import { Dropdown } from 'flowbite';
	import type { DropdownOptions, DropdownInterface } from 'flowbite';
	import { onMount } from 'svelte';
	import FriendTabs from './FriendTabs.svelte';

	onMount(() => {
		const friendsTriggerButton = document.querySelector('#friends-trigger-button');
		const friendsDropdownBody = document.querySelector('#friends-body');

		if (friendsTriggerButton && friendsDropdownBody) {
			const options: DropdownOptions = {
				placement: 'bottom',
				triggerType: 'click',
				offsetSkidding: 0,
				offsetDistance: 10,
				delay: 300
			};

			const dropdown: DropdownInterface = new Dropdown(
				friendsDropdownBody as HTMLElement,
				friendsTriggerButton as HTMLElement,
				options
			);
		}
	});
</script>

<button
	id="friends-trigger-button"
	class="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
	type="button"
>
	<svg
		class="w-6 h-6 dark:text-white"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
		/>
	</svg>
</button>
<div
	id="friends-body"
	class="z-20 hidden w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 dark:divide-gray-700"
	aria-labelledby="friends-dropdown"
>
	<FriendTabs />
</div>
