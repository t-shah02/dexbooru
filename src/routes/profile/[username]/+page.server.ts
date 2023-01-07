import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import dbClient from "$lib/database/dbClient";
import { urlFormer } from '../../../lib/images/uploader';


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

    throw error(404, { message: `A username called ${username} does not exist!` })
}