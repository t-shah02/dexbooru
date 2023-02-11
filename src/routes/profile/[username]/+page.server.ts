import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Action, Actions } from './$types';
import dbClient from '$lib/database/dbClient';
import { urlFormer } from '../../../lib/images/uploader';
import { hashPassword, isStrongPassword, passwordsMatch } from '$lib/auth/helpers';

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
		return { targetUser, sameUser: false };
	}

	throw error(404, { message: `A username called ${username} does not exist!` });
};

const email: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();
		const email = data.get('email');
		const emailConfirm = data.get('emailConfirm');

		if (!email || !emailConfirm) {
			return fail(400, { message: 'failed' });
		}

		if (email !== emailConfirm) {
			return fail(400, { message: 'failed' });
		}

		const updatedUserData = await dbClient.user.update({
			where: {
				id: locals.user.id
			},
			data: {
				email: email.toString()
			},
			select: {
				id: true,
				email: true,
				username: true
			}
		});
	}
};

const password: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();
		const oldPassword = data.get('oldPassword');
		const newPassword = data.get('newPassword');
		const newPasswordConfirm = data.get('newPasswordConfirm');

		if (!oldPassword || !newPassword || !newPasswordConfirm) {
			return fail(400, {});
		}

		if (newPassword !== newPasswordConfirm) {
			return fail(400, {});
		}

		const user = await dbClient.user.findUnique({
			where: {
				id: locals.user.id
			}
		});

		if (user) {
			const realPassword = user.password;
			const passwordsDoMatch = await passwordsMatch(oldPassword.toString(), realPassword);

			if (!passwordsDoMatch) {
				return fail(400, {});
			}

			const passwordChecker = isStrongPassword(newPassword.toString());

			if (Array.isArray(passwordChecker)) {
				return fail(400, { data: passwordChecker });
			}

			const hashedNewPassword = await hashPassword(newPassword.toString());

			await dbClient.user.update({
				where: {
					id: locals.user.id
				},
				data: {
					password: hashedNewPassword
				}
			});

			return { message: 'success' };
		}
	}
};

const username: Action = async ({ request, locals }) => {
	console.log('username');
};

export const actions: Actions = {
	email,
	password,
	username
};
