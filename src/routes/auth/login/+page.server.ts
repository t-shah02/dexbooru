import { fail, redirect } from '@sveltejs/kit';
import type { Actions, Action } from './$types';
import { passwordsMatch } from '$lib/auth/helpers';
import db from '$lib/database/dbClient';
import type { PageServerLoad } from './$types';
import { loginErrors } from '$lib/auth/errorMessages';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

const login: Action = async ({ request, cookies }) => {
	const data = await request.formData();

	const usernameData = data.get('username');
	const passwordData = data.get('password');

	if (!usernameData || !passwordData) {
		return fail(400, { error: loginErrors.missingFields });
	}

	const username = usernameData.toString();
	const testingPassword = passwordData.toString();

	const user = await db.user.findUnique({
		where: {
			username
		}
	});

	if (!user) {
		return fail(404, { error: loginErrors.userDoesNotExist });
	}

	const hashedPassword = user.password;
	const match = await passwordsMatch(testingPassword, hashedPassword);

	if (!match) {
		return fail(403, { error: loginErrors.userDoesNotExist });
	}

	cookies.set('sessionID', user.sessionToken, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 30
	});

	throw redirect(302, '/');
};

export const actions: Actions = {
	default: login
};
