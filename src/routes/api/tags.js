import { getAllTags } from "./_db";


export async function get() {
    return {status : 200, body : await getAllTags()};
}