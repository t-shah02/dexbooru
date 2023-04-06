import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getSavedPostIds } from '$lib/posts/saved';

export const load = (async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(302, '/');
	}

	const savedPostIds = getSavedPostIds(user.savedPosts, user.savedPosts);

	return {
		posts: user.savedPosts,
		savedPostIds
	};
}) satisfies PageLoad;
