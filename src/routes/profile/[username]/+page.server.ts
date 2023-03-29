import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Action, Actions } from './$types';
import dbClient from '$lib/database/dbClient';
import {
	deleteImageFromCloud,
	PROFILE_FOLDER,
	uploadImageToCloud,
	urlFormer
} from '../../../lib/images/uploader';
import { hashPassword, isStrongPassword, isValidUsername, passwordsMatch } from '$lib/auth/helpers';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { validateImage } from '$lib/images/imageServer';
import { routeFriendshipAction } from '$lib/friends/serverHelpers';
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

const profile: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();
		const profilePictureFile = data.get('profilePicture') as File;

		if (!profilePictureFile) {
			return fail(400, { message: 'At least one of the fields was missing!', type: 'error' });
		}

		const profilePictureImageData = await validateImage(profilePictureFile);

		if (typeof profilePictureImageData === 'string') {
			return fail(400, {
				message: 'The profile image that you uploaded does not meet the requirements!',
				type: 'error'
			});
		}

		const profilePictureFileID = locals.user.profilePictureFileID;

		const uploadResponse = await uploadImageToCloud(PROFILE_FOLDER, profilePictureImageData);

		if (profilePictureFileID !== 'default') {
			await deleteImageFromCloud(profilePictureFileID);
		}

		await dbClient.user.update({
			where: {
				id: locals.user.id
			},
			data: {
				profilePictureUrl: uploadResponse.cloudFilePath,
				profilePictureFileID: uploadResponse.cloudFileID
			}
		});

		return { newProfilePictureURL: uploadResponse.cloudFilePath, type: 'success' };
	}
};

const password: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();
		const oldPassword = data.get('oldPassword');
		const newPassword = data.get('newPassword');
		const newPasswordConfirm = data.get('newPasswordConfirm');

		if (!oldPassword || !newPassword || !newPasswordConfirm) {
			return fail(400, { type: 'error', message: 'At least one of the fields was missing!' });
		}

		if (newPassword !== newPasswordConfirm) {
			return fail(400, {
				type: 'error',
				message: 'The new password that was re-entered does not match!'
			});
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
				return fail(400, {
					type: 'error',
					message: 'The old password that was entered is incorrect!'
				});
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

			return { type: 'success', message: 'Your password has been updated successfully!' };
		}
	}
};

const username: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();
		const username = data.get('username');
		const usernameConfirm = data.get('usernameConfirm');

		if (!username || !usernameConfirm) {
			return fail(400, { type: 'error', message: 'At least one of the fields was missing!' });
		}

		if (username.toString() !== usernameConfirm.toString()) {
			return fail(400, {
				type: 'error',
				message: 'The username that was re-entered does not match!'
			});
		}

		if (username.toString() === locals.user.username) {
			return fail(400, {
				type: 'error',
				message: 'The new username is the same as your current username!'
			});
		}

		const validUserNameTest = isValidUsername(username.toString());

		if (typeof validUserNameTest !== 'boolean') {
			return fail(400, {
				type: 'error',
				message: 'The new username does not meet the username requirements!'
			});
		}

		let newProfileRoute: string | null = null;

		try {
			// update the database
			const updatedUser = await dbClient.user.update({
				where: {
					id: locals.user.id
				},
				data: {
					username: username.toString()
				},
				select: {
					username: true
				}
			});

			newProfileRoute = `/profile/${updatedUser.username}`;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				return fail(400, { type: 'error', message: 'Username is already taken' });
			}

			return fail(400, { type: 'error', message: JSON.stringify(error) });
		}

		if (typeof newProfileRoute === 'string') {
			throw redirect(302, newProfileRoute);
		}

		return fail(400, { error: 'error', message: 'Redirect error' });
	}
};

export const actions: Actions = {
	profile,
	password,
	username
};
