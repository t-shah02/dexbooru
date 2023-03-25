import { Redis } from '@upstash/redis';

const REDIS_ENDPOINT_URL = process.env.REDIS_ENDPOINT_URL || '';
const REDIS_API_TOKEN = process.env.REDIS_API_TOKEN || '';

const cacheClient = new Redis({
	url: REDIS_ENDPOINT_URL,
	token: REDIS_API_TOKEN
});

export default cacheClient;
