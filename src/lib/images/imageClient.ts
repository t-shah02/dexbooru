import { MAXIMUM_IMAGE_AREA, MAXIMUM_IMAGE_SIZE_MB } from "./imageConstants";
import { getFileSizeInMB } from "./imageGeneral";

export async function validateImage(file: File) {
    const sizeInMB = getFileSizeInMB(file);

    if (sizeInMB > MAXIMUM_IMAGE_SIZE_MB) {
        return false;
    }
    const encoding = await getImageEncoding(file);
    const [width, height] = await getImageDimensions(encoding);

    const imageArea = width * height;

    if (imageArea > MAXIMUM_IMAGE_AREA) {
        return false;
    }
    return { sizeInMB, fileName: file.name, encoding, width, height, imageFile: file };
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



export function getImageDimensions(imageEncoding: string | ArrayBuffer | null): Promise<[number, number]> {
    return new Promise((resolve, reject) => {

        const image = new Image();

        image.onload = () => {
            resolve([image.naturalWidth, image.naturalHeight]);
        }

        image.onerror = reject;

        image.src = imageEncoding?.toString() || "";

    });

}
