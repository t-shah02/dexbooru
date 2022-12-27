import type { RequestHandler } from "./$types";
import sauceClient from "$lib/images/saucerClient";
import fs from 'fs';
import path from "path";


const SIMILARITY_THRESHOLD = 75.00;
const IMAGE_OUTPUT_PATH = "./src/lib/images/output/"
const BASE64_REGEX = /^data:image\/[a-z]+;base64,/;
const ACCEPTED_IMAGE_FORMAT = ["gif", "jpg", "png", "bmp", "webp", "jpeg"];

// reference: https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
const deleteAllOutputFiles = async () => {
    fs.readdir(IMAGE_OUTPUT_PATH, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(IMAGE_OUTPUT_PATH, file), (err) => {
                if (err) throw err;
            });
        }
    });

}

export const POST = (async ({ request }) => {

    const data = await request.json();
    const { encoding, format }: { encoding: string, format: string } = data;

    const rawImageData = encoding.replace(BASE64_REGEX, "");
    const imageBuffer = Buffer.from(rawImageData, "base64");

    const extension = format.split("image/")[1];
    if (!ACCEPTED_IMAGE_FORMAT.find((ext) => ext === extension)) {
        return new Response(JSON.stringify({ status: `${extension} files are not supported by SauceNAO!` }), { status: 406 });
    }

    const fakeId = crypto.randomUUID();
    const outputFileName = `${fakeId}.${extension}`;
    const outputFilePath = path.join(IMAGE_OUTPUT_PATH, outputFileName);

    let writtenFile = true;
    fs.writeFile(outputFilePath, imageBuffer, (writeError) => {
        if (writeError) {
            writtenFile = false;
        }
    });

    if (!writtenFile) {
        return new Response(JSON.stringify({ status: "Invalid base64 buffer or used invalid image format. Try again!" }), { status: 422 });
    }

    const results = await sauceClient(outputFilePath);
    const bestResults = results.filter((result) => {
        return result.authorName && result.similarity >= SIMILARITY_THRESHOLD
    }).map((result) => {
        return { author: result.authorName, similarity: result.similarity }
    });

    deleteAllOutputFiles();

    return new Response(JSON.stringify(bestResults));

}) satisfies RequestHandler;