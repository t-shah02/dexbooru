import type { Handle } from '@sveltejs/kit';
import db from '$lib/database/dbClient';
import { urlFormer } from '$lib/images/uploader';
import { transformPosts } from '$lib/posts/helpers';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('sessionID');

	if (!sessionToken) {
		return await resolve(event);
	}

	const user = await db.user.findUnique({
		where: { sessionToken },
		select: {
			username: true,
			email: true,
			createdAt: true,
			id: true,
			profilePictureUrl: true,
			profilePictureFileID: true,
			savedPosts: {
				include: {
					author: {
						select: {
							username: true,
							profilePictureUrl: true
						}
					},
					tags: {
						select: {
							name: true
						}
					},
					artists: {
						select: {
							name: true
						}
					}
				}
			},
			friendRequestsReceived: {
				select: {
					sender: {
						select: {
							id: true,
							username: true,
							profilePictureUrl: true
						}
					},
					sentOn: true
				}
			},
			friendRequestsSent: {
				select: {
					receiver: {
						select: {
							id: true,
							username: true,
							profilePictureUrl: true
						}
					},
					sentOn: true
				}
			},
			friends: {
				select: {
					id: true,
					username: true,
					profilePictureUrl: true
				}
			}
		}
	});

	if (user) {
		const {
			id,
			email,
			username,
			profilePictureUrl,
			profilePictureFileID,
			createdAt,
			savedPosts,
			friendRequestsReceived,
			friendRequestsSent,
			friends
		} = user;

		const transformedSavedPosts = transformPosts(savedPosts);

		event.locals.user = {
			id,
			username,
			email,
			profilePictureUrl: urlFormer(profilePictureUrl),
			profilePictureFileID,
			createdAt,
			savedPosts: transformedSavedPosts,
			friendRequestsReceived: friendRequestsReceived.map((request) => {
				return {
					sentOn: request.sentOn,
					...request.sender,
					profilePictureUrl: urlFormer(request.sender.profilePictureUrl)
				};
			}),
			friendRequestsSent: friendRequestsSent.map((request) => {
				return {
					sentOn: request.sentOn,
					...request.receiver,
					profilePictureUrl: urlFormer(request.receiver.profilePictureUrl)
				};
			}),
			friends: friends.map((friend) => {
				return { ...friend, profilePictureUrl: urlFormer(friend.profilePictureUrl) };
			})
		};
	}

	return await resolve(event);
};
