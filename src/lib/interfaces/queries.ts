export interface TagResponse {
	results: string[];
}

export interface TagMapValue {
	tags: string[];
	pageNumber: number;
}

export interface TagResult {
	name: string;
}

export interface ArtistResult {
	name: string;
}

export interface UserResult {
	username: string;
	profilePictureUrl: string;
}

export interface GeneralAutocomplete {
	tags: TagResult[];
	artists: ArtistResult[];
	users: UserResult[];
}

export type FinalAutocompleteResult =
	| TagResult[]
	| ArtistResult[]
	| UserResult[]
	| GeneralAutocomplete;
