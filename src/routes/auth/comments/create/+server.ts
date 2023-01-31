import type { RequestHandler } from './$types';
import dbClient from '$lib/database/dbClient';
import type { CommentBody } from '$lib/interfaces/comments';
import type { Comment } from '$lib/interfaces/comments';

export const POST = (async ({ request, locals }) => {
	if (locals.user) {
		const body: CommentBody = await request.json();
		const { content, postID, parentCommentID } = body;

		const newComment = await dbClient.comment.create({
			data: {
				content,
				postId: postID,
				parentCommentID: parentCommentID !== undefined ? parentCommentID : null,
				authorId: locals.user.id
			}
		});

		const commentResponse: Comment = {
			id: newComment.id,
			createdAt: newComment.createdAt,
			content: newComment.content,
			parentCommentID: newComment.parentCommentID ? newComment.parentCommentID : null,
			author : {
				profilePictureUrl : locals.user.profilePictureUrl,
				username : locals.user.username
			}
		};

		return new Response(JSON.stringify(commentResponse));
	}

	return new Response('You need to be authenticated to access this route!');
}) satisfies RequestHandler;
