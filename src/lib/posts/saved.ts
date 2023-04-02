import type { Post as PrismaPost } from '@prisma/client';
import type { Post as TransformedPost } from '$lib/interfaces/posts';

export function getSavedPostIds(posts: TransformedPost[], savedPosts: TransformedPost[]) {
	const savedPostsOnPage = posts.filter((pagePost) =>
		savedPosts.some((savedPost) => savedPost.postId === pagePost.postId)
	);

	const savedPostIds = savedPostsOnPage.map((post) => post.postId);

	return savedPostIds;
}
