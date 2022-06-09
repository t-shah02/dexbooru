import mongodb, { MONGO_CLIENT_EVENTS } from "mongodb";


const DB_PW = import.meta.env.VITE_DB_PW
const DB_URI = import.meta.env.VITE_DB_URI.replace("<password>",DB_PW);





export async function checkSessionId(session_id) {
    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const db = await client.db("user-db");
    const allUsers = await db.collection("users");
    
    const document = await allUsers.findOne({session_id: session_id});
    await client.close();
    return document;
}