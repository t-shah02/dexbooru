import { fail, redirect } from '@sveltejs/kit';
import type { Actions, Action, PageServerLoad } from './$types';
import { hashPassword, isStrongPassword, isValidUsername } from '$lib/auth/helpers';
import { getFileSizeInMB } from '$lib/images/imageGeneral';
import { MAXIMUM_IMAGE_SIZE_MB } from '$lib/images/imageConstants';
import { uploadImageToCloud, DEFAULT_PROFILE_URL, PROFILE_FOLDER } from '$lib/images/uploader';
import dbClient from '$lib/database/dbClient';
import { registrationErrors } from '$lib/auth/errorMessages';
import { validateImage } from '$lib/images/imageServer';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

const signup: Action = async ({ request }) => {
	const data = await request.formData();

	const emailData = data.get('email');
	const usernameData = data.get('username');
	const passwordData = data.get('password');
	const confirmedPasswordData = data.get('passwordConfirm');
	const profilePictureData = data.get('profilePicture');

	if (!emailData || !usernameData || !passwordData || !confirmedPasswordData) {
		return fail(400, { error: registrationErrors.missingFields });
	}

	const email = emailData.toString();
	const username = usernameData.toString();
	const password = passwordData.toString();
	const confirmedPassword = confirmedPasswordData.toString();

	if (!isValidUsername(username)) {
		return fail(403, { error: registrationErrors.invalidUsername });
	}

	if (!isStrongPassword(password)) {
		return fail(403, { error: registrationErrors.weakPassword });
	}

	if (password !== confirmedPassword) {
		return fail(400, { error: registrationErrors.noPasswordMatch });
	}

	const user = await dbClient.user.findFirst({
		where: {
			OR: [{ email }, { username }]
		}
	});

	if (user) {
		return fail(409, { error: registrationErrors.userExists });
	}

	let finalCloudURL: string | null = null;
	let finalCloudFileID: string | null = null;

	if (profilePictureData) {
		const profilePictureFile = profilePictureData as File;

		if (profilePictureFile.size > 0) {
			const imageData = await validateImage(profilePictureFile);

			if (typeof imageData === 'string') {
				return fail(409, { error: registrationErrors.profileImageTooLarge });
			}

			const uploadResponse = await uploadImageToCloud(PROFILE_FOLDER, imageData);
			finalCloudFileID = uploadResponse.cloudFileID;
			finalCloudURL = uploadResponse.cloudFilePath;
		}
	}

	await dbClient.user.create({
		data: {
			email,
			username,
			password: await hashPassword(password),
			profilePictureUrl: finalCloudURL ? finalCloudURL : DEFAULT_PROFILE_URL,
			profilePictureFileID: finalCloudFileID ? finalCloudFileID : 'default',
			sessionToken: crypto.randomUUID()
		}
	});

	throw redirect(302, '/auth/login');
};

export const actions: Actions = {
	default: signup
};
