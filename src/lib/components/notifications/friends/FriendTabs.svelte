<script lang="ts">
	import { authenticatedUser } from '$lib/stores/userStores';
	import { onMount } from 'svelte';
	import { Tabs } from 'flowbite';
	import type { TabsOptions, TabsInterface, TabItem } from 'flowbite';
	import ReceivedFriendRequests from './ReceivedFriendRequests.svelte';
	import SentFriendRequests from './SentFriendRequests.svelte';
	import Friends from './Friends.svelte';

	onMount(() => {
		const tabElements: TabItem[] = [
			{
				id: 'friends',
				triggerEl: document.querySelector('#friends-tab') as HTMLElement,
				targetEl: document.querySelector('#friends-content') as HTMLElement
			},
			{
				id: 'receivedFriendRequests',
				triggerEl: document.querySelector('#received-friend-requests-tab') as HTMLElement,
				targetEl: document.querySelector('#received-friend-requests-content') as HTMLElement
			},
			{
				id: 'sentFriendRequests',
				triggerEl: document.querySelector('#sent-friend-requests-tab') as HTMLElement,
				targetEl: document.querySelector('#sent-friend-requests-content') as HTMLElement
			}
		];

		// options with default values
		const options: TabsOptions = {
			defaultTabId: 'friends',
			activeClasses:
				'text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500',
			inactiveClasses:
				'text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300'
		};

		const tabs: TabsInterface = new Tabs(tabElements, options);
	});
</script>

<div class="mb-4 border-b border-gray-200 dark:border-gray-700">
	<ul
		class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400 justify-evenly"
		id="all-friend-tabs"
		role="tablist"
	>
		<li class="mr-2" role="presentation">
			<button
				class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
				id="friends-tab"
				type="button"
				role="tab"
				aria-controls="All friends"
				aria-selected="false">Friends ({$authenticatedUser?.friends.length})</button
			>
		</li>
		<li class="mr-2" role="presentation">
			<button
				class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
				id="received-friend-requests-tab"
				type="button"
				role="tab"
				aria-controls="All received friend requests"
				aria-selected="false">Requests ({$authenticatedUser?.friendRequestsReceived.length})</button
			>
		</li>
		<li class="mr-2" role="presentation">
			<button
				class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
				id="sent-friend-requests-tab"
				type="button"
				role="tab"
				aria-controls="All sent friend requests"
				aria-selected="false">Pending ({$authenticatedUser?.friendRequestsSent.length})</button
			>
		</li>
	</ul>
</div>
<div id="friend-tabs-content">
	<div
		class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
		id="friends-content"
		role="tabpanel"
		aria-labelledby="List of all the friends of {$authenticatedUser?.username}"
	>
		<Friends />
	</div>
	<div
		class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
		id="received-friend-requests-content"
		role="tabpanel"
		aria-labelledby="List of all the received friend requests for {$authenticatedUser?.username}"
	>
		<ReceivedFriendRequests />
	</div>
	<div
		class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
		id="sent-friend-requests-content"
		role="tabpanel"
		aria-labelledby="List of all the sent friend requests for {$authenticatedUser?.username}"
	>
		<SentFriendRequests />
	</div>
</div>
