import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import dbClient from '$lib/database/dbClient';
import { urlFormer } from '$lib/images/uploader';
import type { Post } from '$lib/interfaces/posts';
import { getSavedPostIds } from '$lib/posts/saved';

export const load = (async ({ url, locals }) => {
	const tags: string[] = JSON.parse(url.searchParams.get('tags') || '[]');
	const artists: string[] = JSON.parse(url.searchParams.get('artists') || '[]');
	const uploader = url.searchParams.get('uploader') || '';
	const startDate = url.searchParams.get('startDate') || '';
	const endDate = url.searchParams.get('endDate') || '';
	const exactDate = url.searchParams.get('exactDate') || '';

	const andConditions = [];
	const queryComponents: string[] = [];

	if (tags.length) {
		andConditions.push({
			tags: {
				some: {
					name: {
						in: tags
					}
				}
			}
		});

		queryComponents.push(`Tags: ${tags.join(',')}`);
	}

	if (artists.length) {
		andConditions.push({
			artists: {
				some: {
					name: {
						in: artists
					}
				}
			}
		});

		queryComponents.push(`Artists: ${artists.join(',')}`);
	}

	if (uploader.length) {
		andConditions.push({
			author: {
				username: {
					equals: uploader
				}
			}
		});

		queryComponents.push(`Uploader: ${uploader}`);
	}

	if (startDate.length) {
		queryComponents.push(`Upload start date: ${startDate}`);
	}

	if (endDate.length) {
		queryComponents.push(`Upload end date: ${endDate}`);
	}

	if (exactDate.length) {
		queryComponents.push(`Upload exact date: ${exactDate}`);
	}

	const posts = await dbClient.post.findMany({
		where: {
			AND: andConditions,
			createdAt: {
				equals: exactDate.length ? new Date(exactDate) : undefined,
				gte: startDate.length ? new Date(startDate) : undefined,
				lte: endDate.length ? new Date(endDate) : undefined
			}
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
		}
	});

	const cleanedPosts: Post[] = posts.map((postData) => {
		return {
			postId: postData.id,
			date: postData.createdAt,
			views: postData.views,
			nsfw: postData.nsfw,
			images: postData.images.map((imageURL) => urlFormer(imageURL)),
			authorName: postData.author.username,
			authorProfileUrl: urlFormer(postData.author.profilePictureUrl),
			tags: postData.tags.map((data) => data.name),
			artists: postData.artists.map((data) => data.name)
		};
	});

	const savedPostsOnPage = getSavedPostIds(cleanedPosts, locals.user ? locals.user.savedPosts : []);

	return {
		posts: cleanedPosts,
		savedPostsOnPage,
		userQuery: queryComponents.join(' | ').trim()
	};
}) satisfies PageServerLoad;
