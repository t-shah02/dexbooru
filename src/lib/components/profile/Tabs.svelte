<script lang="ts">
	import { Tabs } from 'flowbite';
	import type { TabsOptions, TabsInterface, TabItem } from 'flowbite';
	import { onMount } from 'svelte';

	onMount(() => {
		// create an array of objects with the id, trigger element (eg. button), and the content element
		const tabElements: TabItem[] = [
			{
				id: 'Friends',
				triggerEl: document.querySelector('#friends-tab') as HTMLElement,
				targetEl: document.querySelector('#friends-content') as HTMLElement
			},
			{
				id: 'Statistics',
				triggerEl: document.querySelector('#stats-tab') as HTMLElement,
				targetEl: document.querySelector('#stats-content') as HTMLElement
			}
		];

		// options with default values
		const options: TabsOptions = {
			defaultTabId: 'friends',
			activeClasses:
				'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500',
			inactiveClasses:
				'text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300',
			onShow: () => {
				//console.log('tab is shown');
			}
		};

		/*
		 * tabElements: array of tab objects
		 * options: optional
		 */
		const tabs: TabsInterface = new Tabs(tabElements, options);
	});
</script>

<div class="mb-20">
	<div class="mb-50 border-b border-gray-200 dark:border-gray-700">
		<ul
			class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
			id="tabExample"
			role="tablist"
		>
			<li class="mr-2" role="presentation">
				<button
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
					id="friends-tab"
					type="button"
					role="tab"
					aria-controls="friends tab"
					aria-selected="false">Friends</button
				>
			</li>
			<li class="mr-2" role="presentation">
				<button
					class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
					id="stats-tab"
					type="button"
					role="tab"
					aria-controls="stats tab"
					aria-selected="false">Statistics</button
				>
			</li>
		</ul>
	</div>
	<div id="tabContentExample">
		<div
			class="hidden p-4 bg-gray-50 dark:bg-gray-800"
			id="friends-content"
			role="tabpanel"
			aria-labelledby="profile-tab-example"
		>
			<p>lol</p>
		</div>
		<div
			class="hidden p-4  bg-gray-50 dark:bg-gray-800"
			id="stats-content"
			role="tabpanel"
			aria-labelledby="dashboard-tab-example"
		>
			<p>lol</p>
		</div>
	</div>
</div>
