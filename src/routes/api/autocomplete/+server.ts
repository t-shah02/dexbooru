import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { transformPosts } from '$lib/posts/helpers';
import { error } from '@sveltejs/kit';
import cacheClient from '$lib/database/cacheClient';

const CACHE_CONTROL_TIME = 60;
const CACHE_REDIS_TIME = 60;
const MAXIMUM_NUMBER_OF_SEARCH_RESULTS = 24;

const tsquerySpecialChars = /[()|&:*!]/g;

const cleanQuery = (query: string) => {
	const cleanedForTSQuery = query
		.toLocaleLowerCase()
		.replaceAll(tsquerySpecialChars, ' ')
		.replaceAll('\\', '')
		.trim();
	const queryParts = cleanedForTSQuery.split(' ');
	queryParts.forEach((part, index) => {
		queryParts[index] = `${part.trim()}`;
	});

	return queryParts.join(' | ');
};

export const GET = (async ({ url, setHeaders }) => {
	const query = url.searchParams.get('query');
	const pageNumber = parseInt(url.searchParams.get('page') || '0');

	if (query === null) {
		throw error(400, { message: 'query is a required url parameter for the autocomplete to work' });
	}

	if (isNaN(pageNumber)) {
		throw error(400, {
			message: `page didn't get a valid positive whole number, and got ${pageNumber}`
		});
	}

	const cleanedQuery = cleanQuery(query);

	if (!cleanedQuery.length) {
		throw error(400, { message: 'query must contain at least one query for a full text search' });
	}

	const startTime = performance.now();

	const queryCacheKey = `search?query=${cleanedQuery}`;
	const cachedResults = await cacheClient.get(queryCacheKey);

	if (cachedResults) {
		const endTime = performance.now();

		return new Response(
			JSON.stringify({
				results: cachedResults as string,
				timeTaken: endTime - startTime
			})
		);
	}

	const posts = await dbClient.post.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		where: {
			OR: [
				{
					title: {
						search: cleanedQuery
					}
				},
				{
					title: {
						contains: cleanedQuery
					}
				}
			]
		},
		include: {
			tags: true,
			artists: true,
			author: {
				select: {
					username: true,
					profilePictureUrl: true
				}
			}
		},
		skip: MAXIMUM_NUMBER_OF_SEARCH_RESULTS * pageNumber,
		take: MAXIMUM_NUMBER_OF_SEARCH_RESULTS
	});

	const endTime = performance.now();

	const transformedPosts = transformPosts(posts);
	const stringifiedPosts = JSON.stringify(transformedPosts);

	await cacheClient.set(`search?query=${cleanedQuery}`, stringifiedPosts, {
		ex: CACHE_REDIS_TIME
	});

	setHeaders({
		'cache-control': `max-age=${CACHE_CONTROL_TIME}`
	});

	return new Response(
		JSON.stringify({
			results: transformedPosts,
			timeTaken: endTime - startTime
		})
	);
}) satisfies RequestHandler;
