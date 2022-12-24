import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types';


export const GET = (({ locals, cookies }) => {

    if (locals.user) {
        cookies.set("sessionID", "", {
            path: '/',
            expires: new Date(0),
        });
        
    }

    throw redirect(302, "/");

}) satisfies RequestHandler;

