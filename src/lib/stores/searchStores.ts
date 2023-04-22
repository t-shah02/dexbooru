import type { QueryData } from '$lib/query/autocomplete';
import { writable } from 'svelte/store';

const queryResults = writable<QueryData>({
	currentPage: 0,
	averageTimeTaken: 0,
	allTimesTaken: [],
	results: []
});

export default queryResults;
