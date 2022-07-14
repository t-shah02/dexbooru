import { addPost } from "../../_postdb";

export async function post({ request }) {
    const body = await request.json();
    const {files, uploader, artist, tags} = body;
    
    const postID = await addPost(uploader,tags,artist,files);
    return {status : 200, body : {message : `Created a new post with the following ID: ${postID} for ${uploader}`}}
}
