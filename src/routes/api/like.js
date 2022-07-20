
const likesQueue = [];

export async function patch({request}) { 
    const body = await request.json();
    likesQueue.push(body);
    console.log(likesQueue);
    return {status : 200, body : {message : "Received"}};
}