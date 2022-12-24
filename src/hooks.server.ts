import type { Handle } from '@sveltejs/kit';
import db from '$lib/database/dbClient';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get("sessionID")

    if (!sessionToken) {
        return await resolve(event)
    }

    const user = await db.user.findUnique({
        where: { sessionToken },
        select: { username: true, email: true, createdAt: true },
    });

    if (user) {
        const { email, username, createdAt } = user;
        event.locals.user = {
            username,
            email,
            createdAt
        }
    }

    return await resolve(event)
}