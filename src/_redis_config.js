import Redis from "ioredis";


const REDIS_URL = import.meta.env.VITE_REDIS_URL;

console.log(REDIS_URL);

const redisClient = new Redis(REDIS_URL);


export default redisClient;
