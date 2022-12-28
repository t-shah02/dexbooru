
export interface UploadedImage {
    sizeInMB: number;
    width: number;
    height: number;
    encoding: string | ArrayBuffer | null;
    fileName: string;
}

export interface SauceSuggestion {
    author: string;
    similarity: number;
}