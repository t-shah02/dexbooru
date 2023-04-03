import { writable } from 'svelte/store';
import type { Post } from '$lib/interfaces/posts';


export const authenticatedUser = writable<UserApp | null>(null);
export const authenticatedUserPosts = writable<Post[]>([]);
