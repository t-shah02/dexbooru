import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { fail } from '@sveltejs/kit';
import { transformPosts } from '$lib/posts/helpers';

export const GET = (async ({ params }) => {
	const username = params.username;

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
				}
			}
		}
	});

	if (!postsData) {
		throw fail(404, { message: `No such user called ${username}` });
	}

	const transformedPosts = transformPosts(postsData.posts);

	return new Response(JSON.stringify(transformedPosts));
}) satisfies RequestHandler;
