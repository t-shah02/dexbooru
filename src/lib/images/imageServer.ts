import { error, type HttpError } from '@sveltejs/kit';
import {
	MAXIMUM_IMAGE_AREA,
	MAXIMUM_IMAGE_HEIGHT,
	MAXIMUM_IMAGE_SIZE_MB,
	MAXIMUM_IMAGE_WIDTH
} from './imageConstants';
import sharp, { type Sharp } from 'sharp';
import { getFileSizeInMB } from './imageGeneral';
import type { ProcessedImageServer } from '$lib/interfaces/uploads';
import { uploadImageToCloud } from './uploader';

const formatCompressionOptions: { [key: string]: object } = {
	jpeg: { quality: 90 },
	webp: { quality: 90 },
	png: { compressionLevel: 8 }
};

export const compressImage = async (imageBuffer: Buffer): Promise<Buffer> => {
	const sharpImage = sharp(imageBuffer);
	const metadata = await sharpImage.metadata();
	const format = metadata.format;

	if (format) {
		switch (format) {
			case 'jpeg':
				return await sharpImage.jpeg(formatCompressionOptions.jpeg).toBuffer();
			case 'jpg':
				return await sharpImage.jpeg(formatCompressionOptions.jpeg).toBuffer();
			case 'png':
				return await sharpImage.png(formatCompressionOptions.png).toBuffer();
			case 'webp':
				return await sharpImage.webp(formatCompressionOptions.webp).toBuffer();
			case 'gif':
				return imageBuffer;
			default:
				return imageBuffer;
		}
	}

	return imageBuffer;
};

const optimizeImage = async (image: Sharp) => {
	return await image.webp({ quality: 90 }).toBuffer();
};

export async function validateImage(file: File): Promise<Buffer | string> {
	const imageSizeMB = getFileSizeInMB(file);

	if (imageSizeMB > MAXIMUM_IMAGE_SIZE_MB) {
		return `${file.name} exceeds the maximum image upload size of ${MAXIMUM_IMAGE_SIZE_MB} MB!`;
	}

	const imageArrayBuffer = await file.arrayBuffer();
	const imageBuffer = Buffer.from(imageArrayBuffer);

	// check whether the image meets the area requirements
	const parsedImage = sharp(imageBuffer);
	const { width, height } = await parsedImage.metadata();

	if (!width || !height) {
		return `${file.name} had a parsing error!`;
	}

	const area = width * height;
	if (area > MAXIMUM_IMAGE_AREA) {
		return `${file.name} exceeds the maximum image area of ${MAXIMUM_IMAGE_AREA} (${MAXIMUM_IMAGE_WIDTH}px by ${MAXIMUM_IMAGE_HEIGHT}px)`;
	}

	return await optimizeImage(parsedImage);
}

export async function runUploadPipeline(files: File[]): Promise<string[] | ProcessedImageServer[]> {
	const imageValidationResults = await Promise.all(files.map((file) => validateImage(file)));

	const unacceptableImages = imageValidationResults.filter(
		(result) => typeof result === 'string'
	) as string[];
	if (unacceptableImages.length) {
		return unacceptableImages;
	}

	const cloudImages = await Promise.all(
		imageValidationResults.map((imageBuffer) => uploadImageToCloud('posts', imageBuffer as Buffer))
	);

	return cloudImages;
}
