export interface TagResponse {
    results: string[];
}

export interface TagMapValue {
    tags: string[];
    pageNumber: number;
}

export interface UserQueryResponse {
    username: string;
    profilePictureUrl: string;
}

export interface AutoCompleteResponse {
    tags: string[];
    artists: string[];
    users: UserQueryResponse[];
}