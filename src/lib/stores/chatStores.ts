import type MessageManager from '$lib/chat/manager';
import type { Message } from '$lib/chat/manager';
import type { ModalInterface } from 'flowbite';
import { writable } from 'svelte/store';

export const chatManager = writable<MessageManager | null>(null);
export const messages = writable<Message[]>([]);
export const rateLimitModal = writable<ModalInterface | null>(null);
export const messageContainer = writable<HTMLDivElement | null>(null);
export const messageInput = writable<HTMLInputElement | null>(null);