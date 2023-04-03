import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { error, redirect } from '@sveltejs/kit';
import { routeFriendshipAction } from '$lib/friends/serverHelpers';

export const POST = (async ({ locals, request }) => {
	if (locals.user) {
		const body = await request.json();

		const senderUserId = locals.user.id;
		const operationPerformed = await routeFriendshipAction(body, senderUserId);

		return new Response('The following operation was successful!');
	}

	throw error(401, { message: 'You are not authorized to perform this action' });
}) satisfies RequestHandler;
