import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import dbClient from '$lib/database/dbClient';
import cacheClient from "$lib/database/cacheClient";
import { TAGS_PER_PAGE } from '$lib/query/queryConstants';

export const GET = (async ({ url }) => {
    const queryCharacter = url.searchParams.get("qc");
    const pageData = url.searchParams.get("page");
    const page = pageData ? parseInt(pageData) : 0;

    const tagsToSkip = page * TAGS_PER_PAGE;

    if (!queryCharacter) {
        throw error(400, { message: "Query character should contain 1 ascii character" });
    }


    const cacheQuery = `qc=${queryCharacter}&page=${page}`;

    const cacheHit = await cacheClient.get(cacheQuery);


    if (cacheHit) {
        return new Response(JSON.stringify(cacheHit));
    }

    const tagResults = await dbClient.tag.findMany({
        where: {
            name: {
                startsWith: queryCharacter.toLowerCase()
            }
        },
        select: {
            name: true
        },
        skip: tagsToSkip,
        take: TAGS_PER_PAGE
    });

    const finalTagNames = tagResults.map(tagData => tagData.name.replace("\r", ""));
    const stringResults = JSON.stringify({ results: finalTagNames });

    await cacheClient.set(cacheQuery, stringResults, {
        ex: 120
    });


    return new Response(stringResults);

}) satisfies RequestHandler;