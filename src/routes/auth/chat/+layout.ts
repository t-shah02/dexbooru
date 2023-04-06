import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(302, '/');
	}

	return {
		friends: user.friends
	};
}) satisfies LayoutLoad;
