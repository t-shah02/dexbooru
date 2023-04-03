import type { PageServerLoad } from './$types';
import type { Post } from '$lib/interfaces/posts';
import dbClient from '$lib/database/dbClient';
import cacheClient from '$lib/database/cacheClient';
import { redirect } from '@sveltejs/kit';
import { transformPosts } from '$lib/posts/helpers';
import { getSavedPostIds } from '$lib/posts/saved';

const POSTS_PER_PAGE = 30;

async function getPostsOnPage(pageNumber: number) {
	const cacheQuery = `posts@page${pageNumber}`;
	const cachedPosts: Post[] | null = await cacheClient.get(cacheQuery);

	if (!cachedPosts) return cachedPosts;

	cachedPosts.forEach((post) => {
		post.date = new Date(post.date);
	});

	return cachedPosts;
}

async function setPostsOnPage(pageNumber: number, posts: Post[], expiryInSeconds: number) {
	const cacheQuery = `posts@page${pageNumber}`;
	await cacheClient.set(cacheQuery, JSON.stringify(posts), { ex: expiryInSeconds });
}

export const load: PageServerLoad = async ({ url, locals }) => {
	const pageNumberData = url.searchParams.get('page');
	const pageNumber = pageNumberData ? parseInt(pageNumberData) : 0;

	if (pageNumber < 0) {
		throw redirect(302, '/');
	}

	const recordsToSkip = pageNumber * POSTS_PER_PAGE;

	const cachedPosts = await getPostsOnPage(pageNumber);

	if (cachedPosts) {
		const savedPostsOnPage = getSavedPostIds(
			cachedPosts,
			locals.user ? locals.user.savedPosts : []
		);

		return {
			foundPosts: cachedPosts.length ? true : false,
			savedPostsOnPage,
			posts: cachedPosts,
			pageNumber
		};
	}

	const posts = await dbClient.post.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			author: {
				select: {
					username: true,
					profilePictureUrl: true
				}
			},
			tags: {
				select: {
					name: true
				}
			},
			artists: {
				select: {
					name: true
				}
			}
		},
		skip: recordsToSkip,
		take: POSTS_PER_PAGE
	});

	const cleanedPosts = transformPosts(posts);
	const savedPostsOnPage = getSavedPostIds(cleanedPosts, locals.user ? locals.user.savedPosts : []);

	await setPostsOnPage(pageNumber, cleanedPosts, 50);

	return {
		foundPosts: cleanedPosts.length ? true : false,
		savedPostsOnPage,
		posts: cleanedPosts,
		pageNumber
	};
};
