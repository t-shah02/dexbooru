import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import { error, fail } from '@sveltejs/kit';
import { MAXIMUM_COMMENT_LENGTH } from '$lib/comments/commentConstants';
import { convertAndCleanRawMD } from '$lib/comments/markdownHelpers';
import cacheClient from '$lib/database/cacheClient';
import { urlFormer } from '$lib/images/uploader';
import type { CommentBody } from '$lib/interfaces/comments';

export const POST = (async ({ locals, request }) => {
	if (locals.user) {
		const body: CommentBody = await request.json();
		const content = body.content;
		const postId = body.postID;
		const parentCommentId = body.parentCommentID;

		if (!content || !postId || !parentCommentId) {
			throw error(400, { message: 'At least one of the required fields was missing!' });
		}

		if (content.length < 0 || content.length > MAXIMUM_COMMENT_LENGTH) {
			throw error(400, {
				message: `The comment needs to be between 1 and ${MAXIMUM_COMMENT_LENGTH} characters long!`
			});
		}

		const markdownComment = convertAndCleanRawMD(content);

		const newComment = await dbClient.comment.create({
			data: {
				content: markdownComment,
				parentCommentID: parentCommentId === 'null' ? null : parentCommentId,
				authorId: locals.user.id,
				postId
			},
			select: {
				id: true,
				content: true,
				createdAt: true,
				parentCommentID: true,
				author: {
					select: {
						username: true,
						profilePictureUrl: true
					}
				}
			}
		});

		newComment.author.profilePictureUrl = urlFormer(newComment.author.profilePictureUrl);

		await cacheClient.del(`post-${postId}`);

		return new Response(JSON.stringify(newComment));
	}

	throw error(401, { message: 'You are not authorized to perform this action' });
}) satisfies RequestHandler;
