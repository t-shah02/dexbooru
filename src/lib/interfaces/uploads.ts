
export interface UploadedImage {
    imageFile: File
    sizeInMB: number;
    width: number;
    height: number;
    encoding: string | ArrayBuffer | null;
    fileName: string;
}

export interface ImageBody {
    fileSize: number;
    encoding: string;
    type: string;
}

export interface SauceSuggestion {
    author: string;
    similarity: number;
}

export interface PostMetaData {
    images: string[];
    tags: string[];
    artists: string[];
    nsfw: boolean;
}