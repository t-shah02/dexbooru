import mongodb, { MONGO_CLIENT_EVENTS } from "mongodb";
import * as bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";

const DB_PW = import.meta.env.VITE_DB_PW
const DB_URI = import.meta.env.VITE_DB_URI.replace("<password>",DB_PW);


async function makeUserDocument(email,username,password) {
    
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const userID = uuidv4();
    return {email : email, username: username, password: password,_id : userID};
}


export async function addUser(email,username,password) {
    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const db = await client.db("user-db");
    const allUsers = await db.collection("users");
    const newDoc = await makeUserDocument(email,username,password);
    
    const query = {
        $or : [
            {email : email},
            {username : username}
        ]
    }
    
    const dupeCheck = await allUsers.findOne(query);
    if (dupeCheck) {
        return false;   
    }
    await allUsers.insertOne(newDoc);
    await client.close();
    return true;
}

export async function validateUser(email,password) {
    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const db = await client.db("user-db");
    const allUsers = await db.collection("users");
    const user = await allUsers.findOne({email : email});
    
    if (user) {
        const hashedPassword = user.password;
        if (await bcrypt.compare(password,hashedPassword)) {
            // make session id 
            const sessionID = uuidv4();
            await allUsers.updateOne({email : email},{$set : {session_id : sessionID}});
            await client.close();
            return {result : 1, session_id : sessionID}
        }
        await client.close();
        return {result : -1, session_id : "failed"}
    }
    await client.close();
    return {result : 0, session_id : "failed"}
}

export async function deleteSessionID(email) {
    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const db = await client.db("user-db");
    const allUsers = await db.collection("users");
    const user = await allUsers.updateOne({email : email},{$unset : {session_id : ""}});
    await client.close();
}
