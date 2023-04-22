import type { Handle } from '@sveltejs/kit';
import { isSecureRoute, getSessionUser } from '$lib/middleware/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('sessionID');
	const routePath = event.url.pathname;
	const params = event.url.searchParams;

	if (isSecureRoute(routePath, params)) {
		const sessionUser = await getSessionUser(sessionToken);
		if (sessionUser) {
			event.locals.user = sessionUser;
		}
	}

	return await resolve(event);
};
