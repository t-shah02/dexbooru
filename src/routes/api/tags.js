import { getAllTags } from "../../_postdb";


export async function get() {
    return {status : 200, body : await getAllTags()};
}