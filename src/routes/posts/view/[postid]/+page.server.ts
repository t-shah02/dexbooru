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

		if (cacheHit.comments) {
			for (let i = 0; i < cacheHit.comments.length; i++) {
				cacheHit.comments[i].createdAt = new Date(cacheHit.comments[i].createdAt);
			}
		}

		return { post: cacheHit };
	}

	const post = await dbClient.post.findUnique({
		where: {
			id: postid
		},
		include: {
			tags: true,
			artists: true,
			comments: {
				select: {
					content: true,
					createdAt: true,
					parentCommentID: true,
					id: true,
					author: {
						select: {
							profilePictureUrl: true,
							username: true
						}
					}
				}
			},
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

		post.comments.forEach((comment) => {
			comment.author.profilePictureUrl = urlFormer(comment.author.profilePictureUrl);
		});

		const cleanedData = {
			postId: post.id,
			title: post.title,
			date: post.createdAt,
			views: post.views,
			nsfw: post.nsfw,
			images: post.images.map((imageURL) => urlFormer(imageURL)),
			authorName: post.author.username,
			authorProfileUrl: urlFormer(post.author.profilePictureUrl),
			tags: post.tags.map((data) => data.name),
			artists: post.artists.map((data) => data.name),
			comments: post.comments
		};

		await cacheClient.set(cacheKey, JSON.stringify(cleanedData), { ex: 200 });

		return { post: cleanedData };
	}

	throw redirect(302, '/');
};
