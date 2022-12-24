
const SHORTEN_LENGTH = 10;

export function getFileSizeInMB(file: File): number {
    const totalBytes = file.size;
    return totalBytes / 1024 / 1024;
}

export function shortenFileName(fileName: string): string {
    if (fileName.length <= SHORTEN_LENGTH) return fileName;

    const [name, extension] = fileName.split(".");

    return `${name.slice(0, SHORTEN_LENGTH + 1)}[...].${extension}`;
}

export function getImageEncoding(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            resolve(reader.result);
        }

        reader.onerror = reject;

    });
}
