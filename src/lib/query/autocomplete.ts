import type { Post } from '$lib/interfaces/posts';
import type { Writable } from 'svelte/store';

type AttributeEntry = [string, number];

interface AutocompleteResponse {
	results: Post[];
	timeTaken: number;
}

export interface QueryData {
	results: Post[];
	averageTimeTaken: number;
	allTimesTaken: number[];
	currentPage: number;
}

class NoPostsFoundError extends Error {
	message: string;

	constructor(message: string) {
		super(message);
		this.message = message;
		this.name = 'NoPostsFoundError';
	}
}

function updateCountOfAttribute(attr: string, countsTarget: Map<string, number>) {
	if (countsTarget.has(attr)) {
		const currentCount = countsTarget.get(attr) || 0;
		countsTarget.set(attr, currentCount + 1);
	} else {
		countsTarget.set(attr, 1);
	}
}

function compareCounts(a: AttributeEntry, b: AttributeEntry) {
	const [k1, v1] = a;
	const [k2, v2] = b;

	if (v1 < v2) return 1;
	if (v1 > v2) return -1;

	return 0;
}

function processAttributes(counts: Map<string, number>, size: number): string[] {
	return Array.from(counts.entries())
		.sort(compareCounts)
		.slice(0, size)
		.map((entry) => `${entry[0]} (${entry[1]})`);
}

export function getAtrributeCounts(posts: Post[]) {
	const tagCounts = new Map<string, number>();
	const artistCounts = new Map<string, number>();
	const uploaderCounts = new Map<string, number>();

	posts.forEach((post) => {
		post.tags.forEach((tag) => updateCountOfAttribute(tag, tagCounts));
		post.artists.forEach((artist) => updateCountOfAttribute(artist, artistCounts));
		updateCountOfAttribute(post.authorName, uploaderCounts);
	});

	const finalTagEntries = processAttributes(tagCounts, 10);
	const finalArtistEntries = processAttributes(artistCounts, 5);
	const finalUploaderEntries = processAttributes(uploaderCounts, 5);

	return [finalTagEntries, finalArtistEntries, finalUploaderEntries];
}

async function fetchAutocompleteData(query: string, pageNumber: number = 0) {
	const autcompleteURL = new URL('/api/autocomplete', window.location.origin);
	autcompleteURL.searchParams.set('query', query);
	autcompleteURL.searchParams.set('page', pageNumber.toString());

	const response = await fetch(autcompleteURL);
	if (response.ok) {
		const autocompleteData: AutocompleteResponse = await response.json();

		if (!autocompleteData.results.length)
			throw new NoPostsFoundError(
				`No posts were found for the query: ${query} on page ${pageNumber + 1}`
			);

		autocompleteData.results.forEach((result) => (result.date = new Date(result.date)));

		return autocompleteData;
	}

	throw new Error(`The server responded with status ${response.status}`);
}

class PostSearcher {
	private _queryMap: Map<string, QueryData>;
	private _currentQueryDataStore: Writable<QueryData>;

	constructor(queryStore: Writable<QueryData>) {
		this._currentQueryDataStore = queryStore;
		this._queryMap = new Map<string, QueryData>();
	}

	async search(query: string) {
		if (!query.length) {
			this._currentQueryDataStore.set({
				results: [],
				currentPage: 0,
				averageTimeTaken: 0,
				allTimesTaken: []
			});
			return;
		}

		if (this._queryMap.has(query)) {
			this._currentQueryDataStore.update((currentQueryData) => {
				const data = this._queryMap.get(query);
				if (data) {
					return {
						results: data.results,
						averageTimeTaken: data.averageTimeTaken,
						allTimesTaken: [...data.allTimesTaken, 0],
						currentPage: data.currentPage
					};
				}
				return currentQueryData;
			});

			return;
		}

		try {
			const rawData = await fetchAutocompleteData(query);

			const newQueryData: QueryData = {
				results: rawData.results,
				allTimesTaken: [rawData.timeTaken],
				averageTimeTaken: rawData.timeTaken,
				currentPage: 1
			};

			this._queryMap.set(query, newQueryData);
			this._currentQueryDataStore.set(newQueryData);
		} catch (error) {
			if (error instanceof NoPostsFoundError) {
				return 'No posts found';
			}

			return 'Server error';
		}
	}

	async fetchMorePosts(query: string) {
		try {
			const data = this._queryMap.get(query);

			const rawData = await fetchAutocompleteData(query, data?.currentPage);

			const newResults = (data?.results || []).concat(rawData.results);
			const newTimesTaken = [...(data?.allTimesTaken || []), rawData.timeTaken];
			const newAverageTime =
				newTimesTaken.reduce((acc, timeTaken) => {
					return acc + timeTaken;
				}) / newTimesTaken.length;

			const newQueryData: QueryData = {
				results: newResults,
				allTimesTaken: newTimesTaken,
				averageTimeTaken: newAverageTime,
				currentPage: (data?.currentPage || 0) + 1
			};

			this._queryMap.set(query, newQueryData);
			this._currentQueryDataStore.set(newQueryData);

			return true;
		} catch (error) {
			return false;
		}
	}
}

export default PostSearcher;
