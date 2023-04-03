import { error } from '@sveltejs/kit';
import type { PageServerLoad, Action, Actions } from './$types';
import dbClient from '$lib/database/dbClient';
import { urlFormer } from '../../../lib/images/uploader';
import { getUpdatedFriendState } from '$lib/friends/clientHelpers';

export const load: PageServerLoad = async ({ locals, params }) => {
	const username = params.username;

	if (locals.user && locals.user.username === username) {
		return { targetUser: locals.user, sameUser: true };
	}

	const targetUser = await dbClient.user.findUnique({
		where: {
			username
		},
		select: {
			id: true,
			username: true,
			createdAt: true,
			profilePictureUrl: true
		}
	});

	if (targetUser) {
		targetUser.profilePictureUrl = urlFormer(targetUser?.profilePictureUrl);

		let friendData: {
			isFriend: boolean | null;
			hasRequestedFriendship: boolean | null;
		} = {
			isFriend: null,
			hasRequestedFriendship: null
		};

		if (locals.user) {
			friendData = getUpdatedFriendState(locals.user, targetUser);
		}

		return { targetUser, sameUser: false, friendData };
	}

	throw error(404, { message: `A username called ${username} does not exist!` });
};
