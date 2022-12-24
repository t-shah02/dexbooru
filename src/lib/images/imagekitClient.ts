import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.IMAGEKIT_ENDPOINT || "";
const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || "";
const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";

const imageClient = new ImageKit({
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
    urlEndpoint: ENDPOINT
});


export default imageClient;