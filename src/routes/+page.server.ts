import type { PageServerLoad } from './$types';
import type { Post } from '$lib/interfaces/posts';
import dbClient from '$lib/database/dbClient';
import cacheClient from '$lib/database/cacheClient';
import { urlFormer } from '$lib/images/uploader';
import { generateFilteredPosts } from '$lib/query/postFilters';
import { redirect } from '@sveltejs/kit';

const POSTS_PER_PAGE = 30;

export const load: PageServerLoad = async ({ url }) => {
	const pageNumberData = url.searchParams.get('page');
	const pageNumber = pageNumberData ? parseInt(pageNumberData) : 0;

	if (pageNumber < 0) {
		throw redirect(302, '/');
	}

	const recordsToSkip = pageNumber * POSTS_PER_PAGE;

	const postCacheQuery = `posts?page=${pageNumber}`;
	const postCache: Post[] | null = await cacheClient.get(postCacheQuery);

	if (postCache) {
		postCache.forEach((post) => {
			post.date = new Date(post.date);
		});

		const postCacheCopy = [...postCache];
		const filterData = generateFilteredPosts(postCache);
		return {
			foundPosts: postCache.length ? true : false,
			posts: postCacheCopy,
			filters: filterData,
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

	const cleanedPosts: Post[] = posts.map((postData) => {
		return {
			postId: postData.id,
			date: postData.createdAt,
			views: postData.views,
			nsfw: postData.nsfw,
			images: postData.images.map((imagePath) => {
				if (imagePath.startsWith('https://')) {
					return {
						censored: imagePath,
						uncensored: imagePath
					};
				}

				return {
					censored: urlFormer(imagePath, 'tr=bl-100'),
					uncensored: urlFormer(imagePath)
				};
			}),
			authorName: postData.author.username,
			authorProfileUrl: urlFormer(postData.author.profilePictureUrl),
			tags: postData.tags.map((data) => data.name),
			artists: postData.artists.map((data) => data.name)
		};
	});

	await cacheClient.set(postCacheQuery, JSON.stringify(cleanedPosts), { ex: 50 });

	const cleanedPostsCopy = [...cleanedPosts];
	const filterData = generateFilteredPosts(cleanedPosts);

	return {
		foundPosts: cleanedPosts.length ? true : false,
		posts: cleanedPostsCopy,
		filters: filterData,
		pageNumber
	};
};
