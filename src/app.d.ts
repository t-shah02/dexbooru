// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

interface FriendRequestInformation {
	username: string;
	id: string;
	profilePictureUrl: string;
	sentOn: Date;
}

interface FriendInformation {
	username: string;
	id: string;
	profilePictureUrl: string;
}

interface UserApp {
	id: string;
	username: string;
	email: string;
	profilePictureUrl: string;
	profilePictureFileID: string;
	createdAt: Date;
	posts: import('$lib/interfaces/posts').Post[];
	savedPosts: import('$lib/interfaces/posts').Post[];
	friends: FriendInformation[];
	friendRequestsReceived: FriendRequestInformation[];
	friendRequestsSent: FriendRequestInformation[];
}

declare namespace App {
	// interface Error {}
	interface Locals {
		user: UserApp;
	}

	// interface PageData {}
	// interface Platform {}
}
