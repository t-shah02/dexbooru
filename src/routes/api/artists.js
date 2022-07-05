import {getAllArtists} from "../../_postdb";

export async function get() {
    return {status : 200, body : {artists : await getAllArtists()}};
}