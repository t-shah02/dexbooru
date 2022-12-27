import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ locals, params }) => {
    const username = params.username;

    if (username.length > 5) {
        throw error(400, { message: "lol" });
    }

    return { username };
}