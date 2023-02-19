import dbClient from '$lib/database/dbClient';
import { MAXIMUM_NUMBER_OF_IMAGES_FREE } from '$lib/images/imageConstants';
import { runUploadPipeline } from '$lib/images/imageServer';
import type { ProcessedImageServer } from '$lib/interfaces/uploads';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { Actions, Action } from './$types';

const upload: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();

		const files = data.getAll('files');
		const tags = data.getAll('tags');
		const artists = data.getAll('artists') || ['unknown'];
		const nsfw = data.get('nsfw') || false;

		if (!files || !tags || !files.length || !tags.length) {
			return fail(400, {
				message:
					'An upload needs to have at least one image file and tag, and cannot be left empty!'
			});
		}

		if (files.length > MAXIMUM_NUMBER_OF_IMAGES_FREE) {
			return fail(400, {
				message: `The maximum number of images that can be included in a post is ${MAXIMUM_NUMBER_OF_IMAGES_FREE}!`
			});
		}

		const processedImagesInCloud = await runUploadPipeline(files.valueOf() as File[]);

		if (typeof processedImagesInCloud[0] === 'string') {
			return fail(400, { message: processedImagesInCloud.join('\n') });
		}

		const finalTags = tags.valueOf() as string[];
		const finalArtists = artists.valueOf() as string[];

		const tagUpsertions = finalTags.map((tag) => {
			const tagLowered = tag.toLocaleLowerCase();
			return {
				where: {
					name: tagLowered
				},
				create: { name: tagLowered }
			};
		});

		const artistUpsertions = finalArtists.map((artist) => {
			const artistLowered = artist.toLocaleLowerCase();
			return {
				where: {
					name: artistLowered
				},
				create: { name: artistLowered }
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
				authorId: locals.user.id,
				nsfw: JSON.parse(nsfw.toString()) as boolean,
				images: processedImagesInCloud.map(
					(processedImage) => (processedImage as ProcessedImageServer).cloudFilePath
				)
			}
		});

		return {
			postID: newPost.id,
			postURL: `/posts/view/${newPost.id}`
		};
	}
};

export const actions: Actions = {
	default: upload
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
};
