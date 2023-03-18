import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { cleanQueryResult } from '$lib/query/queryHelpers';
import { urlFormer } from '$lib/images/uploader';
import type {
	AutocompleteResults,
	AutocompleteSearchType,
	UserResult
} from '$lib/interfaces/queries';

const MAX_SERVER_QUERY_CACHE_SIZE = 15;
const serverQueryCache = new Map<string, string>();
const MAXIMUM_NUMBER_OF_SEARCH_RESULTS = 10;

async function getTags(query: string): Promise<string[]> {
	const matches = await dbClient.tag.findMany({
		where: {
			OR: [
				{ name: { startsWith: query } },
				{ name: { contains: query } },
				{ name: { endsWith: query } }
			]
		},
		select: {
			name: true
		},
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	return matches.map((match) => match.name);
}

async function getArtists(query: string): Promise<string[]> {
	const matches = await dbClient.artist.findMany({
		where: {
			OR: [
				{ name: { startsWith: query } },
				{ name: { contains: query } },
				{ name: { endsWith: query } }
			]
		},
		select: {
			name: true
		},
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	return matches.map((match) => match.name);
}

async function getUsers(query: string): Promise<string[]> {
	const matches = await dbClient.user.findMany({
		where: {
			OR: [
				{ username: { startsWith: query } },
				{ username: { contains: query } },
				{ username: { endsWith: query } }
			]
		},
		select: {
			username: true
		},
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	return matches.map((match) => match.username);
}

export const GET = (async ({ url }) => {
	const query = url.searchParams.get('q');
	const searchType = url.searchParams.get('type');

	if (query === null) {
		const errorResponse = new Response(
			'q (query) is a required url parameter for the autocomplete to work',
			{ status: 400 }
		);

		return errorResponse;
	}

	if (searchType === null) {
		const errorResponse = new Response(
			'type (search type) is a required url parameter for the autocomplete to work',
			{ status: 400 }
		);

		return errorResponse;
	}

	const castedSearchType = searchType as AutocompleteSearchType;
	const processedQuery = cleanQueryResult(query);

	let finalResults: string[] = [];

	switch (castedSearchType) {
		case 'artists':
			finalResults = await getArtists(processedQuery);
			break;
		case 'tags':
			finalResults = await getTags(processedQuery);
			break;
		case 'uploader':
			finalResults = await getUsers(processedQuery);
			break;
		default:
			break;
	}

	return new Response(JSON.stringify(finalResults));
}) satisfies RequestHandler;
