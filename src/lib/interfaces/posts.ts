import type { Comment } from './comments';

export interface LikeData {
	postId: string;
	action: number;
}

export interface Post {
	postId: string;
	date: Date;
	views: number;
	nsfw: boolean;
	images: string[];
	authorName: string;
	authorProfileUrl: string;
	tags: string[];
	artists: string[];
	comments?: Comment[];
}

export interface PostFilters {
	views: {
		increasing: Post[];
		decreasing: Post[];
	};
	uploader: {
		increasing: Post[];
		decreasing: Post[];
	};
	date: {
		increasing: Post[];
		decreasing: Post[];
	};
}

interface HistoryItem {
	postID: string;
	historyItemID: string;
	time: Date;
}

export type History = HistoryItem[];
