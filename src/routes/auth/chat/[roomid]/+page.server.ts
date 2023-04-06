import { urlFormer } from '$lib/images/uploader';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}


	const roomId = params.roomid;
	const idParts = roomId.split(' ');
	const authUserId = idParts[0];
	const partnerId = idParts[1];

	if (locals.user.id !== authUserId && locals.user.id !== partnerId) {
		throw redirect(302, '/auth/chat');
	}

	const partner = locals.user.friends.find((friend) => friend.id === partnerId);

	if (!partner) {
		throw redirect(302, '/auth/chat');
	}

	idParts.sort();

	return {
		partner,
		roomName: idParts.join()
	};
}) satisfies PageServerLoad;
