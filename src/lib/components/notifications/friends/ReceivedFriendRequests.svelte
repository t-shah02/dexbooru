<script lang="ts">
	import { Dropdown } from 'flowbite';
	import type { DropdownOptions, DropdownInterface } from 'flowbite';
	import { onMount } from 'svelte';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import LoadingSpinner from '../../svgs/LoadingSpinner.svelte';
	import { makeFriendAPICaller } from '$lib/friends/clientHelpers';
	import { flip } from 'svelte/animate';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { prettifyDate } from '$lib/dates/helpers';

	let loading = false;

	onMount(() => {
		const notificationsTriggerButton = document.querySelector('#notification-trigger-button');
		const notificationsBody = document.querySelector('#notifications-body');

		if (notificationsTriggerButton && notificationsBody) {
			const options: DropdownOptions = {
				placement: 'bottom',
				triggerType: 'click',
				offsetSkidding: 0,
				offsetDistance: 10,
				delay: 300
			};

			const dropdown: DropdownInterface = new Dropdown(
				notificationsBody as HTMLElement,
				notificationsTriggerButton as HTMLElement,
				options
			);
		}
	});

	const onFriendInteraction = async (event: FormEventHandler<HTMLButtonElement>) => {
		loading = true;

		const apiCaller = makeFriendAPICaller(event);

		if (apiCaller) {
			const { receiverUserId, ok, action, receiverProfilePictureUrl, receiverUsername } =
				await apiCaller();

			if (ok) {
				if ($authenticatedUser) {
					$authenticatedUser.friendRequestsReceived =
						$authenticatedUser.friendRequestsReceived.filter(
							(request) => request.id !== receiverUserId
						);

					if (action === 'accept') {
						$authenticatedUser.friends.push({
							id: receiverUserId,
							username: receiverUsername,
							profilePictureUrl: receiverProfilePictureUrl
						});
					}

					authenticatedUser.set($authenticatedUser);
				}
			}
		}

		loading = false;
	};
</script>

{#if $authenticatedUser}
	<ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
		{#each $authenticatedUser.friendRequestsReceived as friendRequest}
			<li class="pb-3 sm:pb-4">
				<div class="flex items-center space-x-4">
					<div class="flex-shrink-0">
						<img
							class="w-8 h-8 rounded-full"
							src={friendRequest.profilePictureUrl}
							alt="profile of {friendRequest.username}"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							{friendRequest.username}
						</p>
						<p class="text-sm text-gray-500 truncate dark:text-gray-400">
							{prettifyDate(friendRequest.sentOn)}
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						{#if !loading}
							<div class="flex">
								<button
									on:click={onFriendInteraction}
									data-action="accept"
									data-receiver-user-id={friendRequest.id}
									data-receiver-username={friendRequest.username}
									data-receiver-profile-picture-url={friendRequest.profilePictureUrl}
									type="button"
									class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
									>Accept</button
								>
								<button
									on:click={onFriendInteraction}
									data-receiver-user-id={friendRequest.id}
									data-receiver-username={friendRequest.username}
									data-receiver-profile-picture-url={friendRequest.profilePictureUrl}
									data-action="reject"
									type="button"
									class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
									>Reject</button
								>
							</div>
						{:else}
							<LoadingSpinner />
						{/if}
					</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
