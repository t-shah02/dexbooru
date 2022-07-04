
export async function post({request}) {
    const body = await request.json();
    const {id,  commentText, author} = body;

    return {status : 200, body : {id}};    
}