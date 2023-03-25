import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { error } from '@sveltejs/kit';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const POST = (async ({ locals, request }) => {
	if (locals.user) {
		const body = await request.json();
		const postId = body.postId;
		const action = body.action;

		if (postId === undefined || action === undefined) {
			throw error(400, { message: 'postId and action are both required fields' });
		}

		if (action !== 'save' && action !== 'unsave') {
			throw error(400, {
				message: 'Invalid action: The action must be either save or unsave'
			});
		}

		try {
			const postTableJoinOperation =
				action === 'save' ? { connect: { id: postId } } : { disconnect: { id: postId } };

			await dbClient.user.update({
				where: {
					id: locals.user.id
				},
				data: {
					savedPosts: postTableJoinOperation
				}
			});
		} catch (dbError) {
			if (dbError instanceof PrismaClientKnownRequestError) {
				throw error(400, { message: `${postId} could not be associated post in the database` });
			}

			throw error(500, {
				message: 'An unknown error occured while updating the database'
			});
		}

		return new Response('done');
	}

	throw error(401, { message: 'You are not authorized to perform this action ' });
}) satisfies RequestHandler;
