import { getSessionUser } from '$lib/middleware/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	if (locals.user) {
		return {
			user: locals.user
		};
	}

	const sessionToken = cookies.get('sessionID');
	const sessionUser = await getSessionUser(sessionToken);

	return {
		user: sessionUser
	};
};
