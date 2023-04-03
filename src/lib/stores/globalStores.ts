import { writable } from 'svelte/store';
import type { ModalInterface } from 'flowbite';

export const searchModalController = writable<ModalInterface | null>(null);
