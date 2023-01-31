import type { RequestHandler } from './$types';
import type { PostMetaData } from '$lib/interfaces/uploads';
import dbClient from '$lib/database/dbClient';

export const POST = (async ({ request, locals }) => {
	if (locals.user) {
		const data: PostMetaData = await request.json();
		const { images, tags, artists, nsfw } = data;

		let finalTags = tags;
		let finalArtists = artists;

		if (!finalTags.length) {
			finalTags = ['untagged'];
		}

		if (!finalArtists.length) {
			finalArtists = ['unknown'];
		}

		const tagUpsertions = finalTags.map((tag) => {
			return {
				where: {
					name: tag
				},
				create: { name: tag }
			};
		});

		const artistUpsertions = finalArtists.map((artist) => {
			return {
				where: {
					name: artist
				},
				create: { name: artist }
			};
		});

		const newPost = await dbClient.post.create({
			data: {
				tags: {
					connectOrCreate: tagUpsertions
				},
				artists: {
					connectOrCreate: artistUpsertions
				},
				images,
				authorId: locals.user.id,
				nsfw
			}
		});

		return new Response(`Post created, with the following metadata: ${JSON.stringify(newPost)}`);
	}

	return new Response('You need to be authenticated to access this route!');
	
}) satisfies RequestHandler;
