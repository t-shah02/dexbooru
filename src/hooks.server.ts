import type { Handle } from '@sveltejs/kit';
import db from '$lib/database/dbClient';
import { urlFormer } from '$lib/images/uploader';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get("sessionID")

    if (!sessionToken) {
        return await resolve(event)
    }

    const user = await db.user.findUnique({
        where: { sessionToken },
        select: { username: true, email: true, createdAt: true, id: true, profilePictureUrl: true },
    });

    if (user) {
        const { id, email, username, profilePictureUrl, createdAt } = user;
        event.locals.user = {
            id,
            username,
            email,
            profilePictureUrl: urlFormer(profilePictureUrl),
            createdAt
        }
    }

    return await resolve(event)
}