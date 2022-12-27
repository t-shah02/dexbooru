import type { RequestHandler } from "./$types";
import imageClient from "$lib/images/imagekitClient";

export const POST = (async ({ request, locals }) => {

    if (locals.user) {
        const data = await request.json();
        const { encoding } = data;

    
         
    }

    return new Response("done");

}) satisfies RequestHandler;