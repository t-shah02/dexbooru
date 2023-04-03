import { passwordsMatch, isStrongPassword, hashPassword, isValidUsername } from '$lib/auth/helpers';
import dbClient from '$lib/database/dbClient';
import { validateImage } from '$lib/images/imageServer';
import { uploadImageToCloud, PROFILE_FOLDER, deleteImageFromCloud } from '$lib/images/uploader';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { PageServerLoad } from './$types';
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
}) satisfies PageServerLoad;

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
