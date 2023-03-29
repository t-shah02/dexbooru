import { urlFormer } from '$lib/images/uploader';
import type { Post as PrismaPost } from '@prisma/client';
import type { Post as TransformedPost } from '$lib/interfaces/posts';

export type DBPost = PrismaPost & {
	author: {
		username: string;
		profilePictureUrl: string;
	};
	tags: {
		name: string;
	}[];
	artists: {
		name: string;
	}[];
};

export function transformPosts(posts: DBPost[]) {
	const cleanedPosts: TransformedPost[] = posts.map((postData) => {
		return {
			postId: postData.id,
			date: postData.createdAt,
			views: postData.views,
			nsfw: postData.nsfw,
			images: postData.images.map((imageURL) => urlFormer(imageURL)),
			authorName: postData.author.username,
			authorProfileUrl: urlFormer(postData.author.profilePictureUrl),
			tags: postData.tags.map((data) => data.name),
			artists: postData.artists.map((data) => data.name)
		};
	});

	return cleanedPosts;
}

export function getSavedPostIds(posts: TransformedPost[], savedPosts: TransformedPost[]) {
	const savedPostsOnPage = posts.filter((pagePost) =>
		savedPosts.some((savedPost) => savedPost.postId === pagePost.postId)
	);

	const savedPostIds = savedPostsOnPage.map((post) => post.postId);

	return savedPostIds;
}
