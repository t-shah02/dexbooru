import { validateUser } from '../../../_authdb';
import { serialize } from 'cookie';

export async function post({request}) {
    const body = await request.json();
    const {email,password} = body;
    const {result, session_id} =  await validateUser(email, password);
    
    // user exists and password is correct
    if (result === 1) {
        const headers =  {
            'Set-Cookie': serialize("session_id",session_id,{
                httpOnly : true,
                maxAge : 60 * 60 * 24 * 7,
                sameSite : process.env.NODE_ENV === 'production',
                path : "/",
            })
        }

        return {status : 200, body : {message : "authenticated"}, headers};
    }

    // user does not exist
    else if (result === 0) {
        return {status : 404, body : {message : "user does not exist"}};
    }
    
    // user exists, but incorrect password came in from the form on /login through the POST request
    else {
        return {status : 403, body : {message : "incorrect password"}};  
    }
}