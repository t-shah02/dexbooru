import type { PageServerLoad } from './$types';
import dbClient from '$lib/database/dbClient';
import cacheClient from '$lib/database/cacheClient';
import { redirect } from '@sveltejs/kit';
import { urlFormer } from '$lib/images/uploader';
import type { Post } from '$lib/interfaces/posts';

export const load: PageServerLoad = async ({ params }) => {
	const { postid } = params;

	const cacheKey = `post-${postid}`;
	const cacheHit: Post | null = await cacheClient.get(cacheKey);

	if (cacheHit) {
		cacheHit.date = new Date(cacheHit.date);

		return { post: cacheHit };
	}

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
		await dbClient.post.update({
			where: {
				id: postid
			},
			data: {
				views: {
					increment: 1
				}
			}
		});

		const cleanedData = {
			postId: post.id,
			date: post.createdAt,
			views: post.views,
			nsfw: post.nsfw,
			images: post.images.map((imagePath) => {
				if (imagePath.startsWith('http')) {
					return {
						censored: imagePath,
						uncensored: imagePath
					};
				}
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

		await cacheClient.set(cacheKey, JSON.stringify(cleanedData), { ex: 200 });

		return { post: cleanedData };
	}

	throw redirect(302, '/');
};
