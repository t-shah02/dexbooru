<script lang="ts">
	import { authenticatedUser } from '$lib/stores/userStores';
	import { EmptyMessageError, MessageTooLongError, RateLimitError } from '$lib/chat/manager';
	import Lens from '../svgs/Lens.svelte';
	import SendArrow from '../svgs/SendArrow.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import LoadingSpinner from '../svgs/LoadingSpinner.svelte';
	import { fade } from 'svelte/transition';
	import { shakeFrames, shakeSettings } from '$lib/animations/shake';
	import type { ModalInterface } from 'flowbite';
	import EmojiPickerWrapper from './EmojiPickerWrapper.svelte';
	import {
		chatManager,
		messages,
		messageContainer,
		messageInput,
		rateLimitModal
	} from '$lib/stores/chatStores';

	export let partner: FriendInformation;
	export let roomId: string;
	export let loadingMessages: boolean = false;
	export let noMoreMessagesToLoad: boolean = false;
	export let jumpToBottomOfChat: boolean = false;

	let message = '';

	const getSenderProfilePictureUrl = (senderId: string) => {
		return $authenticatedUser?.id === senderId
			? $authenticatedUser.profilePictureUrl
			: partner.profilePictureUrl;
	};

	const sendMessage = async () => {
		try {
			if ($chatManager) {
				await $chatManager.sendMessage(message);

				if ($messageContainer) {
					$messageContainer.scrollTop = $messageContainer.scrollHeight;
				}
			}
		} catch (error) {
			if (error instanceof RateLimitError) {
				$rateLimitModal?.show();
				$messageInput?.blur();
			} else if (error instanceof EmptyMessageError) {
			} else if (error instanceof MessageTooLongError) {
			}

			$messageInput?.animate(shakeFrames, shakeSettings);
			message = '';
		}
	};

	const sendMessageOnEnter = async (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			const target = event.target as HTMLInputElement;
			target.value = '';
			await sendMessage();
		}
	};
</script>

<div class="w-3/4 flex flex-col bg-gray-100 border-gray-200 dark:border-gray-600 dark:bg-gray-900">
	<div
		class="flex items-center px-3 py-2 bg-gray-100 border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700"
	>
		<a href="/profile/{partner.username}" class="flex items-center space-x-2">
			<h3 class="font-semibold text-gray-900 dark:text-white">{partner.username}</h3>
			<img
				class="w-10 h-10 rounded-full"
				src={partner.profilePictureUrl}
				alt="profile of {partner.username}"
			/>
		</a>

		{#if jumpToBottomOfChat}
			<button
				in:fade
				on:click={() => {
					if ($messageContainer) {
						$messageContainer.classList.add('scroll-smooth');
						$messageContainer.scrollTop = $messageContainer.scrollHeight;
						$messageContainer.classList.remove('scroll-smooth');
					}
				}}
				type="button"
				class="ml-2 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
			>
				Jump to present
				<i class="ml-1 fa-solid fa-arrow-down" />
			</button>
		{/if}

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
		<div id="all-messages" class="flex-grow overflow-y-auto">
			{#if loadingMessages}
				<div in:fade class="grid mt-5 place-content-center">
					<LoadingSpinner />
				</div>
			{/if}

			{#if noMoreMessagesToLoad}
				<div class="flex flex-col justify-center w-full">
					<p class="text-gray-500 dark:text-gray-400 text-center format">
						This is the beginning of your chat history with {partner.username}
					</p>
					<hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
				</div>
			{/if}

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
		class="flex items-center px-3 py-2 bg-gray-100 border-t border-gray-200 dark:border-gray-600 dark:bg-gray-700 w-full"
	>
		<EmojiPickerWrapper bind:message />

		<input
			on:keydown={sendMessageOnEnter}
			bind:value={message}
			id="chat-input"
			class="resize-none block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder="Message {partner.username}"
		/>
		<button
			type="button"
			on:click={sendMessage}
			class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
		>
			<SendArrow />
			<span class="sr-only">Send message</span>
		</button>
	</div>
</div>
