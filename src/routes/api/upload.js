import { addPost } from "./_db";

export async function post({ request }) {
    const body = await request.json();
    const { tags, artist, encoding, uploader } = body;

    const postID = await addPost(uploader,tags,artist,encoding);

    return {status : 200, body : {message : `Created a new post with the following ID: ${postID} for ${uploader}`}}
}
