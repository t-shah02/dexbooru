<script lang="ts">
	import { authenticatedUser } from '$lib/stores/userStores';
	import { afterUpdate } from 'svelte';

	export let friends: FriendInformation[] = [];
	export let roomId: string;

	afterUpdate(() => {
		const chatItems = document.querySelectorAll('.chat-item') as NodeListOf<HTMLAnchorElement>;
		if (chatItems) {
			chatItems.forEach((chatItem) => {
				const chatItemRoomId = chatItem.dataset.roomId || '';
				if (chatItemRoomId.includes(roomId) && roomId) {
					chatItem.classList.add('bg-gray-100', 'dark:bg-gray-700');
				} else {
					chatItem.classList.remove('bg-gray-100', 'dark:bg-gray-700');
				}
			});
		}
	});
</script>

<aside class="z-40 w-1/4" aria-label="Friends side tab">
	<div class="px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 h-full">
		<h2 class="text-4xl font-extrabold dark:text-white">Friends ({friends.length})</h2>
		<p class="my-4 text-mg text-gray-500">
			Select a conversation
		</p>

		<hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
		<ul class="space-y-2 font-medium">
			{#each friends as friend}
				<li>
					<a
						data-room-id={$authenticatedUser?.id + ' ' + friend.id}
						href="/auth/chat/{$authenticatedUser?.id + ' ' + friend.id}"
						class="chat-item flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<img
							class="w-10 h-10 rounded-full"
							src={friend.profilePictureUrl}
							alt="profile of {friend.username}"
						/>
						<span class="ml-3">{friend.username}</span>
						<i class="fa-solid fa-comments ml-auto" />
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>

<style>
</style>
