import dbClient from '$lib/database/dbClient';
import { MAXIMUM_NUMBER_OF_IMAGES_FREE } from '$lib/images/imageConstants';
import { runUploadPipeline } from '$lib/images/imageServer';
import type { ProcessedImageServer } from '$lib/interfaces/uploads';
import { fail } from '@sveltejs/kit';
import type { Actions, Action } from './$types';
import { urlFormer } from '$lib/images/uploader';

const upload: Action = async ({ request, locals }) => {
	if (locals.user) {
		console.log(locals.user);
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

		const finalTags = (tags.valueOf() as string[]).map((tag) => tag.toLocaleLowerCase().trim());
		const finalArtists = (artists.valueOf() as string[]).map((artist) =>
			artist.toLocaleLowerCase().trim()
		);

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

		const titleParts = [...finalTags, ...finalArtists, locals.user.username];
		const postTitle = titleParts.join(' ');

		const newPost = await dbClient.post.create({
			data: {
				tags: {
					connectOrCreate: tagUpsertions
				},
				artists: {
					connectOrCreate: artistUpsertions
				},
				title: postTitle,
				authorId: locals.user.id,
				nsfw: JSON.parse(nsfw.toString()) as boolean,
				images: processedImagesInCloud.map(
					(processedImage) => (processedImage as ProcessedImageServer).cloudFilePath
				),
				imageIDs: processedImagesInCloud.map(
					(processedImage) => (processedImage as ProcessedImageServer).cloudFileID
				)
			}
		});

		newPost.images = newPost.images.map((imageUrl) => urlFormer(imageUrl));

		return {
			newPost: JSON.stringify(newPost)
		};
	}
};

export const actions: Actions = {
	newPost: upload
};
