import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';

export const GET = (async ({ params }) => {
	const postID = params.id;

	const post = await dbClient.post.findUnique({
		where: {
			id: postID
		}
	});

	return new Response(JSON.stringify(post));
}) satisfies RequestHandler;
