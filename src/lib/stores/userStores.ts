import { writable } from 'svelte/store';

export const authenticatedUser = writable<UserApp | null>(null);
