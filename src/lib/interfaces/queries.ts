export interface TagResponse {
	results: string[];
}

export interface TagMapValue {
	tags: string[];
	pageNumber: number;
}

export interface UserResult {
	username: string;
	profilePictureUrl: string;
}

export interface AutocompleteResults {
	tags: string[];
	artists: string[];
	users: UserResult[];
}

export interface SearchQuery {
	tags?: string[];
	artists?: string[];
	uploader?: string;
	views?: number;
	startDate?: string;
	endDate?: string;
	exactDate?: string;
}

export type AutocompleteSearchType = 'tags' | 'artists' | 'uploader';
