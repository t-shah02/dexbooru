// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

interface UserApp {
	id: string;
	username: string;
	email: string;
	profilePictureUrl: string;
	profilePictureFileID: string;
	createdAt: Date;
}

declare namespace App {
	// interface Error {}
	interface Locals {
		user: UserApp;
	}

	// interface PageData {}
	// interface Platform {}
}
