import type { RequestHandler } from './$types';
import { error, fail } from '@sveltejs/kit';
import dbClient from '$lib/database/dbClient';
import cacheClient from '$lib/database/cacheClient';
import { cleanQueryResult } from '$lib/query/queryHelpers';
import { urlFormer } from '$lib/images/uploader';
import type {
	ArtistResult,
	FinalAutocompleteResult,
	GeneralAutocomplete,
	TagResult,
	UserResult
} from '$lib/interfaces/queries';

type SearchType = 'general' | 'tags' | 'artists' | 'users';

const MAX_SERVER_QUERY_CACHE_SIZE = 15;
const serverQueryCache = new Map<string, string>();
const MAXIMUM_NUMBER_OF_SEARCH_RESULTS = 10;

async function getTags(query: string): Promise<TagResult[]> {
	const loweredQuery = query.toLocaleLowerCase();

	const matches = await dbClient.tag.findMany({
		where: {
			OR: [
				{ name: { startsWith: loweredQuery } },
				{ name: { contains: loweredQuery } },
				{ name: { endsWith: loweredQuery } }
			]
		},
		select: {
			name: true
		},
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	return matches;
}

async function getArtists(query: string): Promise<ArtistResult[]> {
	const loweredQuery = query.toLocaleLowerCase();

	const matches = await dbClient.artist.findMany({
		where: {
			OR: [
				{ name: { startsWith: loweredQuery } },
				{ name: { contains: loweredQuery } },
				{ name: { endsWith: loweredQuery } }
			]
		},
		select: {
			name: true
		},
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	return matches;
}

async function getUsers(query: string): Promise<UserResult[]> {
	const loweredQuery = query.toLocaleLowerCase();

	const matches = await dbClient.user.findMany({
		where: {
			OR: [
				{ username: { startsWith: loweredQuery } },
				{ username: { contains: loweredQuery } },
				{ username: { endsWith: loweredQuery } }
			]
		},
		select: {
			username: true,
			profilePictureUrl: true
		},
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	matches.forEach((match) => {
		match.profilePictureUrl = urlFormer(match.profilePictureUrl);
	});

	return matches;
}

async function getGeneralResults(query: string): Promise<GeneralAutocomplete> {
	const queries: [Promise<ArtistResult[]>, Promise<TagResult[]>, Promise<UserResult[]>] = [
		getArtists(query),
		getTags(query),
		getUsers(query)
	];

	const generalResults = await Promise.all(queries);

	return {
		artists: generalResults[0],
		tags: generalResults[1],
		users: generalResults[2]
	};
}

export const GET = (async ({ url }) => {
	const query = url.searchParams.get('q');
	const searchType = (url.searchParams.get('type') || 'general') as SearchType;

	if (query === null) {
		const errorResponse = new Response(
			'q (query) is a required url parameter for the autocomplete to work',
			{ status: 400 }
		);

		return errorResponse;
	}

	let finalResults: FinalAutocompleteResult | null = null;

	switch (searchType) {
		case 'general':
			finalResults = await getGeneralResults(query);
			break;
		case 'tags':
			finalResults = await getTags(query);
			break;
		case 'artists':
			finalResults = await getArtists(query);
			break;
		case 'users':
			finalResults = await getUsers(query);
			break;
		default:
			break;
	}

	return new Response(JSON.stringify(finalResults));
}) satisfies RequestHandler;
