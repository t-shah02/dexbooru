import type { UploadedImage } from '$lib/interfaces/uploads';
import { MAXIMUM_IMAGE_AREA, MAXIMUM_IMAGE_SIZE_MB } from './imageConstants';
import { getFileSizeInMB } from './imageGeneral';

export async function getImageData(file: File): Promise<UploadedImage | false> {
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
	return {
		sizeInMB,
		encoding,
		width,
		height,
		imageFile: file,
		fileID: crypto.randomUUID()
	};
}

export function getImageEncoding(file: File): Promise<string | ArrayBuffer | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = reject;
	});
}

export function getImageDimensionsOnURL(imageURL: string): Promise<[number, number]> {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.onload = () => {
			resolve([image.naturalWidth, image.naturalHeight]);
		};

		image.onerror = reject;

		image.src = imageURL;
	});
}

export function getImageDimensions(
	imageEncoding: string | ArrayBuffer | null
): Promise<[number, number]> {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.onload = () => {
			resolve([image.naturalWidth, image.naturalHeight]);
		};

		image.onerror = reject;

		image.src = imageEncoding?.toString() || '';
	});
}
