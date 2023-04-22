import db from '$lib/database/dbClient';
import { urlFormer } from '$lib/images/uploader';
import { transformPosts } from '$lib/posts/helpers';

const SERVER_FORM_AUTH_ROUTES = ['/auth/settings', '/auth/upload'];
const AUTH_ROUTES = [
	'/auth/chat',
	'/api/friends',
	'/api/posts/delete',
	'/api/posts/save',
	'/api/comments',
	'/auth/signout',
	'/profile'
];

export function isSecureRoute(routeName: string, searchParams: URLSearchParams) {
	const isRegularAuthRoute = AUTH_ROUTES.some((authRoute) => routeName.startsWith(authRoute));
	if (isRegularAuthRoute) return true;

	const paramKeys = Array.from(searchParams.keys());
	if (!paramKeys.length) return false;

	const isServerFormAuthRoute = SERVER_FORM_AUTH_ROUTES.some((serverFormAuthRoute) =>
		routeName.startsWith(serverFormAuthRoute)
	);
	if (isServerFormAuthRoute) return true;

	return false;
}

export async function getSessionUser(sessionToken: string | undefined): Promise<UserApp | null> {
	if (sessionToken === undefined) return null;

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

	if (!user) return null;

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

	return {
		id,
		username,
		email,
		profilePictureUrl: urlFormer(profilePictureUrl),
		profilePictureFileID,
		createdAt,
		posts: [],
		postPage: 0,
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
