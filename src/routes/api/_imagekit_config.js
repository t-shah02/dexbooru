import ImageKit from "imagekit";

const privateKey = process.env.NODE_ENV !== "production" ? import.meta.env.VITE_IMGKIT_PRIVATE_KEY : process.env.IMGKIT_PRIVATE_KEY;
const publicKey = process.env.NODE_ENV !== "production" ? import.meta.env.VITE_IMGKIT_PUBLIC_KEY :  process.env.IMGKIT_PUBLIC_KEY;
const endpointURL = process.env.NODE_ENV !== "production" ? import.meta.env.VITE_URL_ENDPOINT : process.env.URL_ENDPOINT;


const imgClient = new ImageKit({
    publicKey : publicKey,
    privateKey : privateKey,
    urlEndpoint : endpointURL
});

export default imgClient;