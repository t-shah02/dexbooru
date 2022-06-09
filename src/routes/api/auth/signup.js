import {addUser} from "./_db";

export async function get() {
    return {status : 401, body : {message : "HTTP Request Type: GET is not allowed on this endpoint"}}
}

export async function post({ request }) {
    
    const body = await request.json();
    let {email, password,username} = body; 

    const result = await addUser(email, username, password);
    if (!result) {
        
        return {status : 409, body : {registered : "fail"}};
    }
    
    return {status : 200, body : {registered : "success"}};

}       