import type { PageServerLoad } from "./$types";
import dbClient from "$lib/database/dbClient";
import { urlFormer } from "$lib/images/uploader";

const POSTS_PER_PAGE = 10;


export const load: PageServerLoad = async ({ url }) => {
    const pageNumberData = url.searchParams.get("page");
    const pageNumber = pageNumberData ? parseInt(pageNumberData) : 0;
    const recordsToSkip = pageNumber * POSTS_PER_PAGE;

    const posts = await dbClient.post.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            author: {
                select: {
                    username: true,
                    profilePictureUrl: true
                }
            },
            tags: {
                select: {
                    name: true
                }
            },
            artists: {
                select: {
                    name: true
                }
            }
        },
        skip: recordsToSkip,
        take: POSTS_PER_PAGE
    });

    const cleanedPosts = posts.map((postData) => {
        return {
            postId: postData.id,
            date: postData.createdAt,
            likes: postData.likes,
            nsfw: postData.nsfw,
            images: postData.images.map((imagePath) => {
                return {
                    censored: urlFormer(imagePath, "tr=bl-100"),
                    uncensored: urlFormer(imagePath)
                }
            }),
            authorName: postData.author.username,
            authorProfileUrl: urlFormer(postData.author.profilePictureUrl),
            tags: postData.tags.map((data) => data.name),
            artists: postData.artists.map((data) => data.name)
        }
    })

    return { posts: cleanedPosts };
}   