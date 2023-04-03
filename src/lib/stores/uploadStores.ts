import type { UploadedPost } from '$lib/interfaces/uploads';
import { writable } from 'svelte/store';

export const uploadPost = writable<UploadedPost>({
	imageMetadata: [],
	files: [],
	tags: [],
	artists: [],
	nsfw: false
});

