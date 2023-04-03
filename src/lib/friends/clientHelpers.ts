import type { FormEventHandler } from '$lib/interfaces/inputs';
import type { User } from '$lib/interfaces/users';

const fetchButtonAttributes = (event: FormEventHandler<HTMLButtonElement>) => {
	const target = event.target as HTMLButtonElement;
	const { action, receiverUserId, receiverUsername, receiverProfilePictureUrl } = target.dataset;

	return [action, receiverUserId, receiverUsername, receiverProfilePictureUrl];
};

export function makeFriendAPICaller(event: FormEventHandler<HTMLButtonElement>) {
	const [action, receiverUserId, receiverUsername, receiverProfilePictureUrl] =
		fetchButtonAttributes(event);

	if (action && receiverUserId && receiverUsername && receiverProfilePictureUrl) {
		return async () => {
			const response = await fetch('/api/friends', {
				method: 'POST',
				body: JSON.stringify({ action, receiverUserId })
			});

			return {
				ok: response.ok,
				receiverUserId,
				action,
				receiverUsername,
				receiverProfilePictureUrl
			};
		};
	}

	return null;
}

export function getUpdatedFriendState(user: UserApp, targetUser: User) {
	const friendData: {
		isFriend: boolean | null;
		hasRequestedFriendship: boolean | null;
	} = {
		isFriend: null,
		hasRequestedFriendship: null
	};

	const inFriends = user.friends.some((friend) => friend.username === targetUser.username);
	const inRequestedFriends = user.friendRequestsSent.some(
		(friendRequest) => friendRequest.username === targetUser.username
	);

	friendData.isFriend = inFriends;
	friendData.hasRequestedFriendship = inRequestedFriends;

	return friendData;
}
