import mongodb from "mongodb";
import imgClient from "./_imagekit_config";
import redisClient from "./_redis_config";
import {v4 as uuidv4} from "uuid";
import moment from "moment";
import { afterNavigate } from "$app/navigation";
import { addEmitHelpers } from "typescript";



// const DB_PW = import.meta.env.VITE_DB_PW;
// const DB_URI = import.meta.env.VITE_DB_URI.replace("<password>",DB_PW);
const DB_PW = import.meta.env.VITE_DB_PW;
const DB_URI = import.meta.env.VITE_DB_URI.replace("<password>",DB_PW)





async function makePostDocument(uploader, tags, artist,postID, files) {
        
    const _id = postID;
    const postImages = [];

    for (const [index, file] of Array.from(Object.entries(files))) {
        const {encoding, nsfw} = file;
        const fileName = `post${postID}-${index}`;
        const imageResp = await imgClient.upload(
            {
                file: encoding,
                fileName: fileName,
                folder : "posts",
                useUniqueFileName: false,
    
            }
        );
        const imageURL = imageResp.url;
        const width = imageResp.width;
        const height = imageResp.height;

        const data = {
            imageURL,
            width,
            height,
            nsfw
        }
        postImages.push(data);
    }

    
    const uploadDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    return {uploader,tags,artist,postID,uploadDate,_id, postImages};
}




export async function addPost(uploader, tags, artist, files) {

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const userdb = await client.db("user-db");
    const postdb = await client.db("post-db");
    
    
    const allUsers = await userdb.collection("users");
    const posts = await postdb.collection("posts");
    const tag_collection = await postdb.collection("tags");
    const counterCollection = await postdb.collection("counters");

    const {globalPostTotal} = await counterCollection.findOne({});
    await counterCollection.updateOne({},{$inc : {globalPostTotal : 1}})

    const postDoc = await makePostDocument(uploader, tags, artist,globalPostTotal+1,files);

    for (const tag of tags) {
        const tagDoc = await tag_collection.findOne({name : tag});
        if (tagDoc) {
            await tag_collection.updateOne({name : tag}, {$inc : {postCount : 1}});
        }
        else {
            const newTagDoc = {
                name : tag,
                postCount : 1,
            }
            await tag_collection.insertOne(newTagDoc);
        }
    }
    
    await posts.insertOne(postDoc);
    await allUsers.updateOne({username : uploader}, {$push : {posts : postDoc.postID}});
    


    await client.close();
    
    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    await redisClient.set("totalPosts",String(globalPostTotal+1));

    return postDoc.postID;
}

export async function getAllTags() {
      
    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const cachedTags = await redisClient.get("tags");
    
    if (cachedTags) {
        return JSON.parse(cachedTags);
    }
    
    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const tagCollection = await postdb.collection("tags");

    const allTags = await tagCollection.find({}).toArray();
    await redisClient.setex("tags",300,JSON.stringify(allTags));
    await client.close();

    return allTags;
}

export async function fetchPost(postID) {

    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const cachedPost = await redisClient.get(postID);

    
    if (cachedPost) {
        return JSON.parse(cachedPost);
    }

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const postCollection = await postdb.collection("posts");

    
    const searchPost = await postCollection.findOne({postID : parseInt(postID)});

    await redisClient.setex(postID,600,JSON.stringify(searchPost));

    await client.close();

    return searchPost;
}


export async function getPagePosts(pageNumber, postsPerPage) {

    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const totalPosts = await redisClient.get("totalPosts");
    const totalPages = Math.ceil(parseInt(totalPosts) / postsPerPage);

    const cachedPageData = await redisClient.get(`page${pageNumber}`);

    
    if (cachedPageData) {
        const allPosts = JSON.parse(cachedPageData);
        return {allPosts,totalPages};
    }

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const postCollection = await postdb.collection("posts");

    const allPosts = await postCollection.find({}).skip(pageNumber * postsPerPage).limit(postsPerPage).toArray();
    await redisClient.setex(`page${pageNumber}`,120,JSON.stringify(allPosts));

   

    await client.close();

    return {allPosts, totalPages};
}

export async function getRandomPost() {
    
    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }
    
    const cachedTotal = await redisClient.get("totalPosts");
    const cachedTotalInt = parseInt(cachedTotal);

    const randomPostID = Math.floor(Math.random() * cachedTotalInt) + 1;

    return randomPostID;
}

export async function getUploaderPosts(uploader, pageNumber, postsPerPage) {

    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const cachePosts = await redisClient.get(`posts-${pageNumber}-${uploader}`);  

    if (cachePosts) {
        return JSON.parse(cachePosts);
    }

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const postCollection = await postdb.collection("posts");
    
    const userPosts = await postCollection.find({uploader}).skip(pageNumber * postsPerPage).limit(postsPerPage).toArray();


    await redisClient.setex(`posts-${pageNumber}-${uploader}`,500,JSON.stringify(userPosts));

    return userPosts;
}

export async function addCommentOnPost(id, uploader, commentText) {
    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const postCollection = await postdb.collection("posts");

    await postCollection.updateOne({
        postID : id
    },
    {
        $set : {

        }
    });
    
}

export async function getAllArtists() {

    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const cachedArtists = await redisClient.get("artists");
    
    if (cachedArtists) { 
        return JSON.parse(cachedArtists);
    }
    

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const artistCollection = await postdb.collection("artists");

    const artistsDocs = await artistCollection.find({}).toArray();
    const artists = artistsDocs.map(artistDoc => artistDoc.name);
    
    const finalData = Array.from(new Set(artists));

    await redisClient.setex("artists",300,JSON.stringify(finalData));

    await client.close();
    return finalData;
    
}

export async function searchPosts(tags) {

    if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
        await redisClient.connect();
    }

    const cachedQuery = await redisClient.get(tags.join(" "));
    
    if (cachedQuery) { 
        return JSON.parse(cachedQuery);
    }

    const client = new mongodb.MongoClient(DB_URI);
    await client.connect();
    const postdb = await client.db("post-db");
    const postCollection = await postdb.collection("posts");
    
    const results = await postCollection.find({tags : {$all : tags}}).toArray();
    
    await redisClient.setex(tags.join(" "), 200, JSON.stringify(results));

    await client.close();
    return results;
    
}