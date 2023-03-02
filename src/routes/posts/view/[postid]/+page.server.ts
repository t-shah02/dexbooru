import type { Action, Actions, PageServerLoad } from './$types';
import dbClient from '$lib/database/dbClient';
import cacheClient from '$lib/database/cacheClient';
import { fail, redirect } from '@sveltejs/kit';
import { urlFormer } from '$lib/images/uploader';
import type { Post } from '$lib/interfaces/posts';
import type { Comment } from '$lib/interfaces/comments';
import { MAXIMUM_COMMENT_LENGTH } from '$lib/comments/commentConstants';
import { convertAndCleanRawMD } from '$lib/comments/markdownHelpers';

const newComment: Action = async ({ request, locals }) => {
	if (locals.user) {
		const data = await request.formData();
		const commentData = data.get('comment');
		const postIDData = data.get('postID');
		const parentCommentIDData = data.get('parentCommentID');

		if (!commentData || !postIDData || parentCommentIDData === null) {
			return fail(400, { message: 'At least one of the required fields was missing!' });
		}

		const comment = commentData.toString();
		const postID = postIDData.toString();
		const parentCommentID = parentCommentIDData.toString();

		if (comment.length < 0 || comment.length > MAXIMUM_COMMENT_LENGTH) {
			return fail(400, {
				message: `The comment needs to be between 1 and ${MAXIMUM_COMMENT_LENGTH} characters long!`
			});
		}

		const markdownComment = convertAndCleanRawMD(comment);

		const newComment = await dbClient.comment.create({
			data: {
				content: markdownComment,
				parentCommentID: parentCommentID.length === 0 ? null : parentCommentID,
				authorId: locals.user.id,
				postId: postID
			}
		});

		return {
			message: `Created a new comment on ${postID}, with the parent id of ${parentCommentID}`
		};
	}
};

export const actions: Actions = {
	comment: newComment
};

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
