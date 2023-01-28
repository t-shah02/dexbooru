import type { PageServerLoad } from './$types';
import dbClient from '$lib/database/dbClient';
import { redirect } from '@sveltejs/kit';
import { urlFormer } from '$lib/images/uploader';

export const load: PageServerLoad = async ({ params }) => {
	const { postid } = params;

	const post = await dbClient.post.findUnique({
		where: {
			id: postid
		},
		include: {
			tags: true,
			artists: true,
			author: {
				select: {
					username: true,
					profilePictureUrl: true
				}
			}
		}
	});

	if (post) {
		const cleanedData = {
			postId: post.id,
			date: post.createdAt,
			views: post.views,
			nsfw: post.nsfw,
			images: post.images.map((imagePath) => {
				return {
					censored: urlFormer(imagePath, 'tr=bl-100'),
					uncensored: urlFormer(imagePath)
				};
			}),
			authorName: post.author.username,
			authorProfileUrl: urlFormer(post.author.profilePictureUrl),
			tags: post.tags.map((data) => data.name),
			artists: post.artists.map((data) => data.name)
		};

		return { post: cleanedData };
	}

	throw redirect(302, '/');
};
