import { deleteSessionID } from "./_db";
import { serialize } from "cookie";

export async function get() {
    return {status : 400, body : {message : "GET requests are not allowed on this endpoint"}};
}

export async function post({request}) {
    const body = await request.json();
    const email = body.email;
    await deleteSessionID(email);
    const headers =  {
        'Set-Cookie': serialize("session_id","",{
            httpOnly : true,
            maxAge : 0,
            sameSite : process.env.NODE_ENV === 'production',
            path : "/",
        })};
    
    return {status : 200, body : {message : `logged ${email} out successfully`}, headers : headers};
}