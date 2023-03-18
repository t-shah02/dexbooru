import type { SearchQuery } from '$lib/interfaces/queries';
import { writable } from 'svelte/store';

const emptySearchQuery: SearchQuery = {
	tags: [],
	artists: [],
	uploader: undefined,
	startDate: undefined,
	endDate: undefined,
	exactDate: undefined
};

export const search = writable<SearchQuery>(emptySearchQuery);
