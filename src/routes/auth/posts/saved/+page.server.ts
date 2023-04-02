import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSavedPostIds } from '$lib/posts/saved';

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const savedPostIds = getSavedPostIds(locals.user.savedPosts, locals.user.savedPosts);

	return {
		posts: locals.user.savedPosts,
		savedPostIds
	};
}) satisfies PageServerLoad;
