import { getPagePosts } from "../_db";

export async function get({url}) {
    const page = url.searchParams.get("page");
    const postsPerPage = 6;
    const {allPosts, totalPages} = await getPagePosts(page,postsPerPage);
    return {status : 200, body : {allPosts, totalPages}};
}
