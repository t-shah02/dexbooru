import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { error } from '@sveltejs/kit';
import { deleteImageFromCloud } from '$lib/images/uploader';

export const POST = (async ({ locals, request }) => {
	if (locals.user) {
		const body: { postId: string } = await request.json();
		const postId = body.postId;

		if (!postId) {
			throw error(400, { message: 'postId is a required field' });
		}

		const postToDelete = await dbClient.post.findFirst({
			where: {
				id: postId,
				authorId: locals.user.id
			}
		});

		if (!postToDelete) {
			throw error(401, {
				message:
					"You are not authorized to perform this action, as you aren't the author of this post"
			});
		}

		await dbClient.comment.deleteMany({
			where: {
				postId
			}
		});

		await dbClient.post.delete({
			where: {
				id: postId
			}
		});

		await Promise.all(postToDelete.imageIDs.map((imageId) => deleteImageFromCloud(imageId)));

		return new Response(JSON.stringify({ message: `${postId} was deleted successfully!` }));
	}

	throw error(401, { message: 'You are not authorized to perform this action ' });
}) satisfies RequestHandler;
