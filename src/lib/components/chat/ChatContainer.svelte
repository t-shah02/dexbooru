<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { navbarData, footerData } from '$lib/stores/components';
	import { authenticatedUser } from '$lib/stores/userStores';
	import MessageManager from '$lib/chat/manager';
	import type { Message } from '$lib/chat/manager';
	import { writable } from 'svelte/store';
	import Emoji from '../svgs/Emoji.svelte';
	import Lens from '../svgs/Lens.svelte';
	import SendArrow from '../svgs/SendArrow.svelte';
	import ChatMessage from './ChatMessage.svelte';

	export let partner: FriendInformation;
	export let roomId: string;

	const messages = writable<Message[]>([]);
	let chatManager: MessageManager;
	let message = '';

	const getSenderProfilePictureUrl = (senderId: string) => {
		return $authenticatedUser?.id === senderId
			? $authenticatedUser.profilePictureUrl
			: partner.profilePictureUrl;
	};

	onMount(async () => {
		if ($authenticatedUser && partner) {
			chatManager = new MessageManager(
				roomId,
				messages,
				{
					id: $authenticatedUser.id,
					name: $authenticatedUser.username
				},
				{
					id: partner.id,
					name: partner.username
				}
			);

			await chatManager.setup();
		}
	});

	onDestroy(() => {
		if (chatManager) {
			chatManager.destroy();
		}
	});
</script>

<div
	style="top: {$navbarData.height}px; bottom: {$footerData.height}px"
	class="w-full h-full flex flex-col fixed bg-gray-100 border-gray-200 dark:border-gray-600 dark:bg-gray-900"
>
	<div
		class="flex items-center px-3 py-2 bg-gray-100 border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700"
	>
		<div class="flex items-center space-x-2">
			<h3 class="font-semibold text-gray-900 dark:text-white">{partner.username}</h3>
			<img
				class="w-10 h-10 rounded-full"
				src={partner.profilePictureUrl}
				alt="profile of {partner.username}"
			/>
		</div>

		<div class="ml-auto">
			<button
				type="button"
				class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
			>
				<Lens />
				<span class="sr-only">Search </span>
			</button>
		</div>
	</div>

	{#if $messages}
		<div class="flex-1 overflow-y-auto">
			{#each $messages as message}
				<ChatMessage
					content={message.content}
					senderName={message.senderName}
					dateSent={message.sentAt}
					senderProfilePictureURL={getSenderProfilePictureUrl(message.senderId)}
				/>
			{/each}
		</div>
	{/if}
	<div
		style="bottom: {$footerData.height}px"
		class="flex-1 fixed flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 w-full max-h-max"
	>
		<button
			type="button"
			class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
		>
			<Emoji />
			<span class="sr-only">Add emoji</span>
		</button>

		<textarea
			bind:value={message}
			id="chat"
			rows="1"
			class="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Message {partner.username}"
		/>
		<button
			type="button"
			on:click={async () => await chatManager.sendMessage(message)}
			class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
		>
			<SendArrow />
			<span class="sr-only">Send message</span>
		</button>
	</div>
</div>
