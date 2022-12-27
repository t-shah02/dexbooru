
export interface UploadedImage {
    blob: File;
    encoding: string | ArrayBuffer | null;
    fileName: string;
}

export interface SauceSuggestion {
    author: string;
    similarity: number;
}