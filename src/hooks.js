import { parse } from 'cookie';
import {checkSessionId} from "./_sessiondb";
import redisClient from "./_redis_config";
import imgClient from "./_imagekit_config";
import {addPost} from "./_postdb";
import {addUser} from "./_authdb";


/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const cookies = parse(event.request.headers.get("cookie") || "");
    if (!cookies.session_id) {
        event.locals.user = {authenticated : false};
        const response = resolve(event);
        return response;
    }    

    const user = await checkSessionId(cookies.session_id);
    if (user) {
        event.locals.user = {authenticated :true, email : user.email, username : user.username, pfp : user.profilePictureURL, posts : JSON.stringify(user.posts)};
    }
    else {
        event.locals.user = {authenticated :false};
    }

    const response = resolve(event);
    return response;

}




export function getSession(event) {

    if (event.locals.user.authenticated) {
        return {authenticated : event.locals.user.authenticated, email : event.locals.user.email, username : event.locals.user.username, pfp : event.locals.user.pfp, posts : event.locals.user.posts};
    }

    return {authenticated : event.locals.user.authenticated};
    
}


