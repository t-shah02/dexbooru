import { writable } from 'svelte/store';
import type { Comment } from '$lib/interfaces/comments';

export const allComments = writable<Comment[]>([]);
