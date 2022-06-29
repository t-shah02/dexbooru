import ImageKit from "imagekit";

const privateKey = import.meta.env.VITE_IMGKIT_PRIVATE_KEY;
const publicKey = import.meta.env.VITE_IMGKIT_PUBLIC_KEY;
const endpointURL = import.meta.env.VITE_URL_ENDPOINT;


const imgClient = new ImageKit({
    publicKey : publicKey,
    privateKey : privateKey,
    urlEndpoint : endpointURL
});

export default imgClient;