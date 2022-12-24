import sagiri from "sagiri";
import dotenv from "dotenv";

dotenv.config();

const SAUCENAO_API_KEY = process.env.SAUCENAO_API_KEY || "";
const sauceClient = sagiri(SAUCENAO_API_KEY);

export default sauceClient;

