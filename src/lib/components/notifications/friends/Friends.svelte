<script lang="ts">
	import { authenticatedUser } from '$lib/stores/userStores';
</script>

{#if $authenticatedUser}
	<ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
		{#each $authenticatedUser.friends as friend}
			<li class="pb-3 sm:pb-4">
				<div class="flex items-center space-x-4">
					<div class="flex-shrink-0">
						<img
							class="w-8 h-8 rounded-full"
							src={friend.profilePictureUrl}
							alt="profile of {friend.username}"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							{friend.username}
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						<a
							data-sveltekit-reload
							href="/profile/{friend.username}"
							class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
							>View profile</a
						>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
