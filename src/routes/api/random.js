import { getRandomPost } from "./_db"


export async function get() {
    const randomPostID = await getRandomPost();
    return {status : 200, body : {randomPostID}};
}