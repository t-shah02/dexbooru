<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import type { User } from '$lib/interfaces/users';
	import { authenticatedUser } from '$lib/stores/userStores';

	export let user: User;
	export let sameUser: boolean;

	const prettyDate = prettifyDate(user.createdAt);
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
				<a
					href="#"
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Add friend</a
				>
				<a
					href="#"
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
					>Message</a
				>
			</div>
		{/if}
	</div>
</div>
