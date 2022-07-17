
import { searchPosts } from "../../_postdb.js";

export async function post({request}) {
    const body = await request.json();
    const tags = body.criteria;
    const posts = await searchPosts(tags);
    
    return {status : 200, body : {posts}};
}