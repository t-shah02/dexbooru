import { fail, redirect } from '@sveltejs/kit';
import type { Actions, Action, PageServerLoad } from './$types';
import { hashPassword, isStrongPassword, isValidUsername } from "$lib/auth/helpers";
import { getFileSizeInMB } from '$lib/images/parsing';
import { MAXIMUM_IMAGE_SIZE_MB } from '$lib/images/imageConstants';
import { uploadImageToCloud, DEFAULT_PROFILE_URL, PROFILE_FOLDER } from '$lib/images/uploader';
import db from "$lib/database/dbClient";
import { registrationErrors } from '$lib/auth/errorMessages';


export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, "/");
    }
}

const signup: Action = async ({ request }) => {
    const data = await request.formData();

    const emailData = data.get("email");
    const usernameData = data.get("username");
    const passwordData = data.get("password");
    const confirmedPasswordData = data.get("confirmedPassword");
    const profilePictureFile = data.get("profilePicture");


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


    const user = await db.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    });

    if (user) {
        return fail(409, { error: registrationErrors.userExists });
    }

    let profileImageBuffer: Buffer | null = null;
    let profileImageFormat = "";
    let finalCloudURL = "";

    if (profilePictureFile instanceof Blob) {

        const imageSize = getFileSizeInMB(profilePictureFile);
        if (imageSize > MAXIMUM_IMAGE_SIZE_MB) {
            return fail(400, { error: registrationErrors.profileImageTooLarge })
        }


        const profileArrayBuffer = await profilePictureFile.arrayBuffer();
        profileImageBuffer = Buffer.from(profileArrayBuffer);
        profileImageFormat = profilePictureFile.type.split("/")[1];
    }



    if (profileImageBuffer) {
        const profileImageFileName = `${username}_profile.${profileImageFormat}`;
        const { uploadedImage, uploadedURL } = await uploadImageToCloud(profileImageFileName, PROFILE_FOLDER, profileImageBuffer);
        if (uploadedImage) {
            finalCloudURL = uploadedURL;
        }
    }


    await db.user.create({
        data: {
            email,
            username,
            password: await hashPassword(password),
            profilePictureUrl: finalCloudURL ? finalCloudURL : DEFAULT_PROFILE_URL,
            sessionToken: crypto.randomUUID()
        }
    });


    throw redirect(302, "/auth/login");
}

export const actions: Actions = {
    default: signup
}