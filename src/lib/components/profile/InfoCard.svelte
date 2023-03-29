<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import { getUpdatedFriendState, makeFriendAPICaller } from '$lib/friends/clientHelpers';
	import type { FormEventHandler } from '$lib/interfaces/inputs';
	import type { User } from '$lib/interfaces/users';
	import { authenticatedUser } from '$lib/stores/userStores';
	import { onDestroy } from 'svelte';
	import LoadingSpinner from '../svgs/LoadingSpinner.svelte';

	export let user: User;
	export let sameUser: boolean;
	export let friendStatus:
		| { isFriend: boolean | null; hasRequestedFriendship: boolean | null }
		| undefined;

	const prettyDate = prettifyDate(user.createdAt);

	let loading = false;

	const userDestroy = authenticatedUser.subscribe((authUser) => {
		console.log('did this');
		if (authUser) {
			friendStatus = getUpdatedFriendState(authUser, user);
		}
	});

	onDestroy(userDestroy);

	const onFriendInteraction = async (event: FormEventHandler<HTMLButtonElement>) => {
		loading = true;

		const apiCaller = makeFriendAPICaller(event);

		if (apiCaller) {
			const { ok, action, receiverUserId } = await apiCaller();

			if (ok) {
				if ($authenticatedUser) {
					if (action === 'friend') {
						$authenticatedUser.friendRequestsSent.push({
							id: user.id,
							profilePictureUrl: user.profilePictureUrl,
							username: user.username,
							sentOn: new Date(Date.now())
						});
					} else if (action === 'unfriend') {
						$authenticatedUser.friends = $authenticatedUser.friends.filter(
							(friend) => friend.id !== user.id
						);
					}

					authenticatedUser.set($authenticatedUser);
				}
			}
		}

		loading = false;
	};
</script>

<div
	class="mt-20 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
>
	<div class="flex justify-end px-4 pt-4" />
	<div class="flex flex-col items-center pb-10">
		<img
			class="w-24 h-24 mb-3 rounded-full shadow-lg"
			src={user.profilePictureUrl}
			alt="profile picture of {user.username}"
		/>
		<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.username}</h5>
		<span class="text-sm text-gray-500 dark:text-gray-400 text-center"
			>Join date:
			<span class="text-sm text-green-400 dark:text-green-400">{prettyDate}</span>
		</span>
		{#if !sameUser && $authenticatedUser !== null}
			<div class="flex mt-4 space-x-3 md:mt-6">
				{#if friendStatus && friendStatus.isFriend !== null && friendStatus.hasRequestedFriendship !== null}
					{#if friendStatus.hasRequestedFriendship}
						<button
							disabled
							class="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
							>Pending friend request</button
						>
					{:else if friendStatus.isFriend}
						<button
							on:click={onFriendInteraction}
							data-action="unfriend"
							data-receiver-user-id={user.id}
							data-receiver-username={user.username}
							data-receiver-profile-picture-url={user.profilePictureUrl}
							class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
							>Remove friend</button
						>
						<a
							href="#"
							class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
							>Message</a
						>
					{:else}
						<button
							on:click={onFriendInteraction}
							data-action="friend"
							data-receiver-user-id={user.id}
							data-receiver-username={user.username}
							data-receiver-profile-picture-url={user.profilePictureUrl}
							class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>Add friend</button
						>
					{/if}
				{/if}

				{#if loading}
					<LoadingSpinner />
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	button:disabled {
		cursor: not-allowed;
	}
</style>
