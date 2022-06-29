import {fetchPost} from "../../../../_postdb";

export async function get({params}) {
    const postID = params.postid;
    return {status : 200, body : await fetchPost(postID)};
}
