


export function getFileSizeInMB(file: File | Blob): number {
    const totalBytes = file.size;
    return totalBytes / 1024 / 1024;
}

export async function imageToBlob(fileEncoding: string): Promise<Blob> {
    const response = await fetch(fileEncoding);
    const blob = await response.blob();
    return blob;
}