import imageClient from "./imagekitClient";
import { ENDPOINT } from "$lib/images/imagekitClient";
import { compressImage } from './imageServer';

export const PROFILE_FOLDER = "profile_pictures"
export const DEFAULT_PROFILE_URL = "assets/default_profile_k1tJoKFet.png";
export const urlFormer = (filePath: string, urlParams: string = ""): string => `${ENDPOINT}/${filePath}?${urlParams}`

export async function uploadImageToCloud(fileName: string, folder: string, file: Buffer) {
    let uploadedImage = true;

    const compressedBuffer = await compressImage(file);

    const response = await imageClient.upload({
        file: compressedBuffer,
        fileName,
        folder
    });



    return { uploadedImage, uploadedURL: response.filePath };
}