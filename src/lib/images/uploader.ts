import imageClient from "./imagekitClient";
import { ENDPOINT } from "$lib/images/imagekitClient";

export const PROFILE_FOLDER = "profile_pictures";
export const DEFAULT_PROFILE_URL = "https://ik.imagekit.io/hhqleju8jy/assets/default_profile_k1tJoKFet.png";
export const profileUrlFormer = (filePath : string) : string => `${ENDPOINT}/${filePath}`

export async function uploadImageToCloud(fileName: string, folder: string, file: Buffer) {
    let uploadedImage = true;

    const response = await imageClient.upload({
        file,
        fileName,
        folder
    });

    return { uploadedImage, uploadedURL: response.filePath };
}