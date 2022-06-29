import mongodb from "mongodb";
import redisClient from "./_redis_config";

const DB_PW = import.meta.env.VITE_DB_PW;
const DB_URI = import.meta.env.VITE_DB_URI.replace("<password>",DB_PW)

console.log(DB_PW,DB_URI);


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