import { error, type HttpError } from "@sveltejs/kit";
import Jimp from "jimp";
import { MAXIMUM_IMAGE_AREA, MAXIMUM_IMAGE_SIZE_MB } from "./imageConstants";
import sharp from "sharp";

const formatCompressionOptions: { [key: string]: object } = {
    jpeg: { quality: 80 },
    webp: { quality: 80 },
    png: { compressionLevel: 8 }
};

export const compressImage = async (imageBuffer: Buffer): Promise<Buffer> => {
    const sharpImage = await sharp(imageBuffer);
    const metadata = await sharpImage.metadata();
    const format = metadata.format;

    if (format) {

        switch (format) {
            case "jpeg":
                return await sharpImage.jpeg(formatCompressionOptions.jpeg).toBuffer();
            case "jpg":
                return await sharpImage.jpeg(formatCompressionOptions.jpeg).toBuffer();
            case "png":
                return await sharpImage.png(formatCompressionOptions.png).toBuffer();
            case "webp":
                return await sharpImage.webp(formatCompressionOptions.webp).toBuffer();
            case "gif":
                return imageBuffer;
            default:
                return imageBuffer;
        }
    }

    return imageBuffer;
}



export async function validateImage(imageBuffer: Buffer, fileSize: number): Promise<HttpError | boolean> {

    if (fileSize > MAXIMUM_IMAGE_SIZE_MB) {
        return error(406, `The maximum image size is ${MAXIMUM_IMAGE_SIZE_MB}MB`);
    }

    const image = await sharp(imageBuffer);
    const { width, height } = await image.metadata();

    if (width && height) {
        const imageArea = width * height;
        if (imageArea > MAXIMUM_IMAGE_AREA) {
            return error(406, `The maximum image area is ${MAXIMUM_IMAGE_AREA}px^2`);
        }
    }



    return true;
}