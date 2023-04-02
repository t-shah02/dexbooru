import type { RequestHandler } from "./$types"
import { error } from '@sveltejs/kit';
import { uploadImageToCloud } from "$lib/images/uploader";
import { validateImage } from "$lib/images/imageServer";
import type { ImageBody } from "$lib/interfaces/uploads";

export const POST = (async ({ request, locals }) => {

    if (locals.user) {

        const imageData: ImageBody = await request.json();
        const { encoding, fileSize, type } = imageData;

        const cleanedEncoding = encoding.split("base64,")[1];

        const imageBuffer = Buffer.from(cleanedEncoding, "base64");

        const validationResult = await validateImage(imageBuffer, fileSize);

        if (typeof validationResult !== "boolean") {
            throw validationResult;
        }

        const fileName = crypto.randomUUID();

        if (type === "post") {
            const uploadResponse = await uploadImageToCloud(fileName, "posts", imageBuffer);
            if (uploadResponse.uploadedImage) {
                return new Response(uploadResponse.uploadedURL);
            }

            throw error(422, `Could not upload the file called ${fileName} to the server`);

        }
        
        

        if (type === "profile") {
            const uploadResponse = await uploadImageToCloud(fileName, "profile_pictures", imageBuffer);
            if (uploadResponse.uploadedImage) {
                return new Response(uploadResponse.uploadedURL);
            }

            throw error(422, `Could not upload the file called ${fileName} to the server`);
        }

        throw error(400, `The type called ${type} is not a valid upload type for our servers`);

    }

    throw error(401, "You are not authenticated, so this route is blocked for you!");

}) satisfies RequestHandler;