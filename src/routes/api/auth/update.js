import { parse } from "cookie";
import { checkSessionId } from "../../../_sessiondb";
import { updateUsername,updatePassword, updateEmail } from "../../../_authdb";



export async function put({ request }) {
    const body = await request.json();
    const cookie = request.headers.get("cookie") || false;

    const errorJSON = { status: 403, body: { message: "This request was not made from an authenticated user. Access denied." } };

    if (!cookie) {
        return errorJSON;
    }

    const { session_id } = parse(cookie) || false;

    if (!session_id) {
        return errorJSON;
    }

    const userCheck = await checkSessionId(session_id);

    if (userCheck) {
        const { operation } = body;

        if (operation === "username") {
            const { oldUserName, newUsername } = body;
            const result = await updateUsername(oldUserName, newUsername, userCheck, session_id);
            if (result) {
                return { status: 200, body: { message: `Username ${oldUserName} has been updated to ${newUsername}` } };
            }
            return { status: 409, body: { message: `Username ${newUsername} already exists!` } }
        }
        else if (operation === "password") {
            const {newPassword,email} = body;
            const result = await updatePassword(newPassword, email, userCheck, session_id);
            if (result) {
                return { status: 200, body: { message: `Password of ${email} was updated successfully`}};
            }
            return {status : 409, body : { message: `The password for: ${email} could not be updated, please try again later!`}};
            
        }
        else if (operation === "email") {
            const {newEmail, oldEmail} = body;
            const result = await updateEmail(oldEmail,newEmail,userCheck,session_id);
            if (result) {
                return {status : 200, body : {message : `The email for ${oldEmail} was changed to ${newEmail} successfully`}}
            }
            return {status : 409, body : { message: `A user with the email ${newEmail} already exists, please try again later!`}};
        }
        else {
            return {status : 400, body : {message : `${operation} cannot be handled at the given time!`}};
        }
    }

    return errorJSON;


}