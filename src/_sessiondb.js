import mongodb from "mongodb";
import redisClient from "./routes/api/_redis_config";

const DB_PW = process.env.NODE_ENV !== "production" ? import.meta.env.VITE_DB_PW : process.env.DB_PW;
const DB_URI = process.env.NODE_ENV !== "production" ? import.meta.env.VITE_DB_URI.replace("<password>",DB_PW) : process.env.DB_URI?.replace("<password>",DB_PW);





export async function checkSessionId(session_id) {

    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const user = await redisClient.get(session_id);
    if (user) {
        return JSON.parse(user);
    }

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const db = await client.db("user-db");
    const allUsers = await db.collection("users");
    
    const document = await allUsers.findOne({session_id: session_id});
    await client.close();

    await redisClient.setex(session_id,120,JSON.stringify(document));

    return document;
}