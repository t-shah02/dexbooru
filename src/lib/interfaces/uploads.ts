export interface UploadedImage {
	fileID: string;
	imageFile: File;
	sizeInMB: number;
	width: number;
	height: number;
	encoding: string | ArrayBuffer | null;
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

export interface UploadedPost {
	imageMetadata: UploadedImage[];
	files: File[];
	tags: string[];
	artists: string[];
	nsfw: boolean;
}

export interface ProcessedImageServer {
	imageFileID: string;
	cloudFilePath: string;
	cloudFileID: string;
}
