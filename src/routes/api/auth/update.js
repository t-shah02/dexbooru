import {parse} from "cookie";
import {checkSessionId} from "../../../_sessiondb";
import {updateUsername} from "../../../_authdb";



export async function put({request}) {
    const body = await request.json();
    const cookie = request.headers.get("cookie") || false;
    
    const errorJSON = {status : 403, body : {message : "This request was not made from an authenticated user. Access denied."}};

    if (!cookie) {
        return errorJSON;
    }

    const {session_id} = parse(cookie) || false;
    
    if (!session_id) {
        return errorJSON;
    }

    const userCheck = await checkSessionId(session_id);

    if (userCheck) {
        const {oldUserName,newUsername} = body;
        const result = await updateUsername(oldUserName, newUsername,userCheck,session_id);
        if (result) {
            return {status : 200, body : {message : `Username ${oldUserName} has been updated to ${newUsername}`}};
        }
        return {status : 409, body : {message : `Username ${newUsername} already exists!`}}
    }
    
    return errorJSON;


}