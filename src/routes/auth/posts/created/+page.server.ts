import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dbClient from '$lib/database/dbClient';
import { transformPosts } from '$lib/posts/helpers';
import { getSavedPostIds } from '$lib/posts/saved';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const userPosts = await dbClient.post.findMany({
		where: {
			authorId: locals.user.id
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

	const transformedPosts = transformPosts(userPosts);
	const savedPostIds = getSavedPostIds(transformedPosts, locals.user.savedPosts);

	return {
		posts: transformedPosts,
		savedPostIds
	};
}) satisfies PageServerLoad;
