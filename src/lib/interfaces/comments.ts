export interface Comment {
	id: string;
	content: string;
	createdAt: Date;
	parentCommentID: string | null;
	author: {
		profilePictureUrl: string;
		username: string;
	};
}

export interface CommentBody {
	content: string;
	postID: string;
	parentCommentID: string;
}
