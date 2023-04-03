import dbClient from '$lib/database/dbClient';
import type { FormEventHandler } from '$lib/interfaces/inputs';
import { error } from '@sveltejs/kit';

type FriendAction = 'friend' | 'unfriend' | 'accept' | 'reject';

const friendActions = ['friend', 'unfriend', 'accept', 'reject'];

async function sendFriendRequest(senderUserId: string, receiverUserId: string) {
	await dbClient.friendRequest.create({
		data: {
			senderId: senderUserId,
			receiverId: receiverUserId
		}
	});
}

async function acceptFriendRequest(senderUserId: string, receiverUserId: string) {
	await dbClient.user.update({
		where: {
			id: receiverUserId
		},
		data: {
			friends: {
				connect: {
					id: senderUserId
				}
			}
		}
	});

	await dbClient.user.update({
		where: {
			id: senderUserId
		},
		data: {
			friends: {
				connect: {
					id: receiverUserId
				}
			}
		}
	});

	await dbClient.friendRequest.deleteMany({
		where: {
			OR: [
				{
					senderId: senderUserId,
					receiverId: receiverUserId
				},
				{
					senderId: receiverUserId,
					receiverId: senderUserId
				}
			]
		}
	});
}

async function rejectFriendRequest(senderUserId: string, receiverUserId: string) {
	await dbClient.friendRequest.deleteMany({
		where: {
			OR: [
				{
					senderId: senderUserId,
					receiverId: receiverUserId
				},
				{
					senderId: receiverUserId,
					receiverId: senderUserId
				}
			]
		}
	});
}

async function removeFriend(senderUserId: string, receiverUserId: string) {
	await dbClient.user.update({
		where: {
			id: receiverUserId
		},
		data: {
			friends: {
				disconnect: {
					id: senderUserId
				}
			}
		}
	});

	await dbClient.user.update({
		where: {
			id: senderUserId
		},
		data: {
			friends: {
				disconnect: {
					id: receiverUserId
				}
			}
		}
	});
}

export async function routeFriendshipAction(
	body: { [key: string]: string | undefined },
	senderUserId: string
) {
	const { action, receiverUserId } = body;

	if (action === undefined || receiverUserId === undefined) {
		throw error(400, { message: 'At least one of the required fields is missing' });
	}

	if (!friendActions.includes(action)) {
		throw error(400, { message: "The action that was given isn't a valid one" });
	}

	switch (action as FriendAction) {
		case 'friend':
			await sendFriendRequest(senderUserId, receiverUserId);
			break;
		case 'unfriend':
			await removeFriend(senderUserId, receiverUserId);
			break;
		case 'accept':
			await acceptFriendRequest(receiverUserId, senderUserId);
			break;
		case 'reject':
			await rejectFriendRequest(receiverUserId, senderUserId);
			break;
		default:
			break;
	}

	return true;
}
