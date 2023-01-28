import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";
import dbClient from "$lib/database/dbClient";
import cacheClient from "$lib/database/cacheClient";
import { cleanQueryResult } from "$lib/query/queryHelpers";
import { urlFormer } from "$lib/images/uploader";

const MAX_SERVER_QUERY_CACHE_SIZE = 15;
const serverQueryCache = new Map<string, string>();


export const GET = (async ({ url }) => {

    const query = url.searchParams.get("q");
    const numResultsData = url.searchParams.get("resultLimit");
    const numResults = numResultsData ? parseInt(numResultsData) : 5;

    if (!query) {
        throw error(400, "q is a required url parameter for doing the autocompletion search");
    }

    if (isNaN(numResults)) {
        throw error(400, "Please ensure that the resultLimit parameter is a positive whole number");
    }


    const cleanQuery = query.trim().toLowerCase();

    if (serverQueryCache.has(cleanQuery)) {
        return new Response(serverQueryCache.get(cleanQuery));
    }

    const cacheHit = await cacheClient.get(cleanQuery);

    if (cacheHit) {
        return new Response(JSON.stringify(cacheHit));
    }

    const tagsAndArtistsQuery = {
        where: {
            OR: [
                { name: { startsWith: cleanQuery } },
                { name: { endsWith: cleanQuery } },
                { name: { contains: cleanQuery } }
            ]
        },
        select: {
            name: true
        },
        take: numResults
    }

    const tagResults = await dbClient.tag.findMany(tagsAndArtistsQuery);
    const artistResults = await dbClient.artist.findMany(tagsAndArtistsQuery);
    const userResults = await dbClient.user.findMany({
        where: {
            username: {
                contains: cleanQuery
            }
        },
        select: {
            username: true,
            profilePictureUrl: true
        },
        take: numResults
    });


    const tags = tagResults.map(data => cleanQueryResult(data.name));
    const artists = artistResults.map(data => cleanQueryResult(data.name));
    const users = userResults.map((data) => {
        return {
            username: cleanQueryResult(data.username),
            profilePictureUrl: urlFormer(data.profilePictureUrl)
        };
    })

    const finalData = JSON.stringify({ tags, artists, users })

    serverQueryCache.set(cleanQuery, finalData);
    await cacheClient.set(cleanQuery, finalData, {
        ex: 45
    });


    if (serverQueryCache.size > MAX_SERVER_QUERY_CACHE_SIZE) {
        serverQueryCache.clear();
    }

    return new Response(finalData);

}) satisfies RequestHandler;