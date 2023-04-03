import imageClient from './imagekitClient';
import { ENDPOINT } from '$lib/images/imagekitClient';
import type { ProcessedImageServer } from '$lib/interfaces/uploads';

export const PROFILE_FOLDER = 'profile_pictures';
export const POSTS_FOLDER = 'posts';
export const DEFAULT_PROFILE_URL = '/assets/default_profile_k1tJoKFet.png';
export const urlFormer = (filePath: string): string => `${ENDPOINT}/${filePath}`;

export async function uploadImageToCloud(
	folder: string,
	imageBuffer: Buffer
): Promise<ProcessedImageServer> {
	const fileName = crypto.randomUUID();

	const response = await imageClient.upload({
		file: imageBuffer,
		fileName,
		folder
	});

	return {
		cloudFilePath: response.filePath,
		cloudFileID: response.fileId,
		imageFileID: fileName
	};
}

export async function deleteImageFromCloud(cloudImageID: string) {
	const response = await imageClient.deleteFile(cloudImageID);
}
