import {getUploaderPosts} from "../../../../_postdb";

export async function get({params, url}) {
    const username = params.username;
    const pageNumber = parseInt(url.searchParams.get("page") || 0);
    const postsPerPage = 6;
    const posts = await getUploaderPosts(username,pageNumber,postsPerPage);
    return {status : 200, body : {posts}};
}