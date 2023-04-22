import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { error } from '@sveltejs/kit';
import { transformPosts } from '$lib/posts/helpers';

const POSTS_PER_PAGE = 25;

export const GET = (async ({ params, url }) => {
	const username = params.username;
	const pageNumber = parseInt(url.searchParams.get('page') || '0');

	const postsData = await dbClient.user.findUnique({
		where: {
			username
		},
		select: {
			posts: {
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
				skip: pageNumber * POSTS_PER_PAGE,
				take: POSTS_PER_PAGE
			}
		}
	});

	if (!postsData) {
		throw error(404, { message: `No such user called ${username}` });
	}

	const transformedPosts = transformPosts(postsData.posts);

	return new Response(JSON.stringify(transformedPosts));
}) satisfies RequestHandler;
