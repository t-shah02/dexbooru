<script lang="ts">
	import { prettifyDate } from '$lib/dates/helpers';
	import { authenticatedUser } from '$lib/stores/userStores';

	$authenticatedUser?.friendRequestsSent;
</script>

{#if $authenticatedUser}
	<ul class="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
		{#each $authenticatedUser.friendRequestsSent as pendingRequest}
			<li class="pb-3 sm:pb-4">
				<div class="flex items-center space-x-4">
					<div class="flex-shrink-0">
						<img
							class="w-8 h-8 rounded-full"
							src={pendingRequest.profilePictureUrl}
							alt="profile of {pendingRequest.username}"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							{pendingRequest.username}
						</p>
						<p class="text-sm text-gray-500 truncate dark:text-gray-400">
							{prettifyDate(pendingRequest.sentOn)}
						</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{/if}
