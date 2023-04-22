<script lang="ts">
	import type { PageData } from './$types';
	import ChatContainer from '$lib/components/chat/ChatContainer.svelte';
	import MessageManager from '$lib/chat/manager';
	import { authenticatedUser } from '$lib/stores/userStores';
	import {
		chatManager,
		messageContainer,
		messageInput,
		messages,
		rateLimitModal
	} from '$lib/stores/chatStores';
	import { onMount } from 'svelte';
	import { Modal, type ModalOptions } from 'flowbite';
	import RateLimitModal from '$lib/components/chat/RateLimitModal.svelte';

	export let data: PageData;
	let roomId: string;
	let partner: FriendInformation;
	let loadingMessages = false;
	let noMoreMessagesToLoad = false;
	let jumpToBottomOfChat = false;

	onMount(async () => {
		const mContainer = document.querySelector('#all-messages') as HTMLDivElement;
		const chatInput = document.querySelector('#chat-input') as HTMLInputElement;
		messageContainer.set(mContainer);
		messageInput.set(chatInput);

		await refreshChatManager();
		setupRateLimitModal();
		setupMessageContainer();
	});

	const setupRateLimitModal = () => {
		const rateLimitModalContainer = document.querySelector('#rate-limiter-modal') as HTMLElement;

		if (rateLimitModalContainer) {
			const modalOptions: ModalOptions = {
				placement: 'center',
				backdrop: 'dynamic',
				backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-100',
				closable: true
			};

			const rlModal = new Modal(rateLimitModalContainer, modalOptions);
			rateLimitModal.set(rlModal);
		}
	};

	const setupMessageContainer = () => {
		if ($messageContainer) {
			$messageContainer.scrollTop = $messageContainer.scrollHeight;

			$messageContainer.addEventListener('scroll', async () => {
				if ($messageContainer) {
					if (!noMoreMessagesToLoad) {
						if ($messageContainer?.scrollTop === 0) {
							const oldScrollHeight = $messageContainer.scrollHeight;

							loadingMessages = true;

							const moreToLoad = $chatManager ? await $chatManager.fetchMessages() : false;

							if (!moreToLoad) {
								noMoreMessagesToLoad = true;
							}

							loadingMessages = false;

							const newScrollHeight = $messageContainer.scrollHeight - oldScrollHeight;
							$messageContainer.scrollTop += newScrollHeight;

							jumpToBottomOfChat = true;
						}
					}

					const percentageScrolled = $messageContainer.scrollTop / $messageContainer.scrollHeight;
					jumpToBottomOfChat = percentageScrolled <= 0.4 ? false : true;
				}
			});
		}
	};

	const refreshChatManager = async () => {
		if ($chatManager) {
			$chatManager.destroy();
		}

		if ($authenticatedUser && partner) {
			messages.set([]);
			chatManager.set(
				new MessageManager(
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
				)
			);

			if ($chatManager) {
				loadingMessages = true;
				await $chatManager.setup();
				loadingMessages = false;
			}
		}
	};

	$: {
		roomId = data.roomName;
		partner = data.partner;

		refreshChatManager();
	}
</script>

<svelte:head>
	<title>Chat with {partner.username}</title>
</svelte:head>

<RateLimitModal onClose={() => $rateLimitModal?.hide()} />
<ChatContainer {partner} {roomId} {loadingMessages} {noMoreMessagesToLoad} {jumpToBottomOfChat} />
