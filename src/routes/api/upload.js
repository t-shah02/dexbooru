import { addPost } from "../../_postdb";

export async function post({ request }) {
    const body = await request.json();
    const { tags, artist, encoding, uploader, nsfw } = body;

    const postID = await addPost(uploader,tags,artist,encoding,nsfw);

    return {status : 200, body : {message : `Created a new post with the following ID: ${postID} for ${uploader}`}}
}
