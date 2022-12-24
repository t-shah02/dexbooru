import { fail, redirect } from '@sveltejs/kit';
import type { Actions, Action, PageServerLoad } from './$types';
import { hashPassword, isStrongPassword, isValidUsername } from "$lib/auth/helpers";
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


    await db.user.create({
        data: {
            email,
            username,
            password: await hashPassword(password),
            sessionToken: crypto.randomUUID()
        }
    });


    throw redirect(302, "/auth/login");
}

export const actions: Actions = {
    default: signup
}