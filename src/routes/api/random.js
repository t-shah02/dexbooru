import { getRandomPost } from "../../_postdb"


export async function get() {
    const randomPostID = await getRandomPost();
    return {status : 200, body : {randomPostID}};
}